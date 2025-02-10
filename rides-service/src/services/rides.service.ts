import { AMQPConnectionExcepitions, DatabaseExceptions, ValidationExceptions } from '../exceptions/index'
import { ICreateRider,userMongoId } from "../controller/types"
import MainQueueManager from '../queues/mainQueueManager'
import UserRepository from '../repository/user.repository'
import { isMatchLength } from '../utils/transformData'
import { isMatchString } from '../utils/transformData'
import RidesRepository from '../repository/rides.repository'
import { publishMessageToRider } from '../queues/producer/riderPublisher'
import { riderConfig } from '../config/queue.config'
import { IQueueConfig } from '../queues/types'

class RidesServices {
    private amqpServices : MainQueueManager
    private userRepository : UserRepository
    private ridesRepository : RidesRepository

    constructor(){
        this.amqpServices = new MainQueueManager()
        this.userRepository = new UserRepository()
        this.ridesRepository = new RidesRepository()
    }

    public async createRideServices(userId : userMongoId, parseBody : ICreateRider) : Promise<any|void> {
        const riderChannel = this.amqpServices.getChannel()
        const userDoc = await this.userRepository.findUserById(userId)

        if(typeof userDoc === 'object' && !userDoc) {
            throw new DatabaseExceptions(`The User Does not Exists, Please Try Again`)
        }

        const isRider = userDoc.hasOwnProperty('_id') ? userDoc.rider : null

        if(isRider) {
            throw new DatabaseExceptions(`The Rider cannot create Rides Itself, only The User can create the Rides`)
        }

        const {currentLocation , geometry, destination, price} = parseBody
        const isValidObject =  typeof parseBody === 'object'  && Object.entries(parseBody).length > 0

        if(isValidObject) {
            const isValidPrice = typeof price === 'number'  && Math.abs(price) > 0 ? price : 0.0

            if(Math.floor(isValidPrice).toString().startsWith('0')) {
                throw new ValidationExceptions(`The Price does not match , It is currently 0`)
            }

            const validGeometry = geometry.hasOwnProperty('lat') && geometry.hasOwnProperty('lng')

            if(!validGeometry) {
                throw new DatabaseExceptions(`The Geometry Longitude and Langitude either one of the following properties is missing`)
            }

            const trimCurrentLocation = currentLocation.length > 0 ? currentLocation.trim().split('').join('') : ''
            const trimDestination  = destination.length > 0 ? destination.trim().split('').join('') : '' 
            const isValidMatch =  isMatchLength(trimCurrentLocation,trimDestination) && isMatchString(trimCurrentLocation,trimDestination)

            if(isValidMatch)  {
                throw new DatabaseExceptions(`The Current and Destination Location is Matches.., Please use Seprate Destination Location`)
            }

            const currentDate = new Date().toISOString()
            const savedPayload : {
                ride_started_at : Date,
                ride_rider : string,
                ride_user : userMongoId,
                ride_money : number,
                ride_current_location : string,
                ride_destination_location : string
            } = {
                ride_started_at : new Date(currentDate),
                ride_rider : 'Not Assigned',
                ride_user: userDoc._id as any,
                ride_money : price,
                ride_current_location : currentLocation,
                ride_destination_location : destination
            }

            const riderPayload  = {
                user : userDoc,
                rider_properties : savedPayload
            }

            const savedResult =  this.ridesRepository.savedResult({...savedPayload})
            const publishMessaged = publishMessageToRider(riderPayload,riderChannel,riderConfig as IQueueConfig)

            const callbackPromiseArr = await Promise.allSettled([
                savedResult,
                publishMessaged
            ])
            const filteredRejected = callbackPromiseArr.length > 0 ? callbackPromiseArr.filter((data:any) => data.status !== 'fulfilled') : []
            if(filteredRejected.length.toString().startsWith('0')) {
                throw new AMQPConnectionExcepitions(`There is some error while publishing to the rider queue`,503)
            }
            return savedResult
        }
    }   
}

export default RidesServices