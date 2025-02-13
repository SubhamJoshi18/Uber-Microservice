import { AMQPConnectionExcepitions, DatabaseExceptions, ValidationExceptions } from '../exceptions/index'
import { ICreateRider,userMongoId } from "../controller/types"
import UserRepository from '../repository/user.repository'
import { isMatchLength } from '../utils/transformData'
import { isMatchString } from '../utils/transformData'
import RidesRepository from '../repository/rides.repository'
import { publishMessageToRider } from '../queues/producer/riderPublisher'
import { riderConfig } from '../config/queue.config'
import { IQueueConfig } from '../queues/types'
import MainQueueManager from '../queues/mainQueueManager'
import RidesOfferRepository from '../repository/riderOffer.repository'
import { uberLogger } from '../libs/common.logger'
import { publishMessageToRiderStatus } from  '../queues/producer/riderStatusPublisher'
import { ridesStatusConfig } from '../config/queue.config'
import RiderRepository from '../repository/rider.repository'

class RidesServices {

    private userRepository : UserRepository
    private ridesRepository : RidesRepository
    private ridesOfferRepository : RidesOfferRepository
    private riderRepository : RiderRepository

    constructor(){
  
        this.userRepository = new UserRepository()
        this.ridesRepository = new RidesRepository()
        this.ridesOfferRepository = new RidesOfferRepository()
        this.riderRepository = new RiderRepository()
    }

    public async createRideServices(userId : userMongoId, parseBody : ICreateRider) : Promise<any|void> {
        const riderChannel = await MainQueueManager.getChannel()
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
                ride_rider : any,
                ride_user : userMongoId,
                ride_money : any,
                ride_current_location : string,
                ride_destination_location : string,
                ride_estimation_time : string
            } = {
                ride_started_at : new Date(currentDate),
                ride_rider : 'Not Assigned',
                ride_user: userDoc._id as any,
                ride_money : price,
                ride_current_location : currentLocation,
                ride_destination_location : destination,
                ride_estimation_time : 'Not Started'
            }

            const riderPayload  = {
                user : userDoc,
                rider_properties : savedPayload
            }

            const savedResult =  await this.ridesRepository.savedResult({...savedPayload})
            const publishMessaged = publishMessageToRider(riderPayload,riderChannel as any,riderConfig as IQueueConfig)

            const callbackPromiseArr = await Promise.allSettled([
                savedResult,
                publishMessaged
            ])
            const filteredRejected = callbackPromiseArr.length > 0 ? callbackPromiseArr.filter((data:any) => data.status !== 'fulfilled') : []
            if(!filteredRejected.length.toString().startsWith('0')) {
                throw new AMQPConnectionExcepitions(`There is some error while publishing to the rider queue`,503)
            }
            return savedResult
        }
    }   

    public async getAllRidesOffer(ridesId : any) {
        const allRides = await this.ridesRepository.getAllRidesOffer(ridesId)


        if(!allRides || (allRides && allRides.length === 0)){
            throw new DatabaseExceptions(`The Rides Does not Have any offer or it is already Accepted by someone`)
        }
        const filteredAccepted = allRides.filter((data:any) => data.riderOffer === 'ACCEPTED')
        if(Array.isArray(filteredAccepted) && filteredAccepted.length > 0){
            throw new DatabaseExceptions(`The Rides has been already Accepted by someone`)
        }
        return allRides
    }

    public async acceptOffer(idsObject : {userId : any, offerId : any}) : Promise<any> { 
        const {userId, offerId} = idsObject
        const riderStatusChannel = await MainQueueManager.getChannel()

        const allUserOffer = await this.ridesOfferRepository.getAllUserFlares(userId)

        const mappedOffer :any = allUserOffer.filter((data:any) => data.userId == userId && data._id == offerId).pop()


        const extractedRidesId = mappedOffer._doc['ridesId']
        const extractedRiderId = mappedOffer._doc['riderId']
 
        const allDocFetch = await Promise.allSettled([
            this.userRepository.findUserById(userId),
            this.ridesRepository.getRidesById(extractedRidesId),
            this.ridesOfferRepository.getRiderOfferById(offerId),
            this.riderRepository.getRiderName(extractedRiderId)
        ])

        const filteredRejection = Array.isArray(allDocFetch) && allDocFetch.length > 0  ? allDocFetch.filter((data:any) => data.status !== 'fulfilled') : null

        if(filteredRejection && filteredRejection.length > 0){
            throw new DatabaseExceptions(`There are some error while retriving the documents from the system, Internal Server Error`)
        }

        const userDoc = allDocFetch[0]['value']
        const ridesDoc = allDocFetch[1]['value']
        const ridesOfferDoc = allDocFetch[2]['value']
        const riderNameDoc = allDocFetch[3]['value']
  
        const isAlreadyAccepted = typeof ridesOfferDoc.riderOffer === 'string' && !ridesOfferDoc.riderOffer.startsWith('NOT')
        if(isAlreadyAccepted){
            throw new DatabaseExceptions(`The Offer has been already Accepted`)
        }
        uberLogger.info(`The ${userDoc.username} is accepting the offer`)

       
        const isOfferExists = ridesDoc.offers.filter((data:any) => data == offerId)

        if(Array.isArray(isOfferExists) && isOfferExists){
          
            const clearOffers = await this.ridesRepository.clearOffer(extractedRidesId)
            const currentDate = new Date()
            const payloadUpdate = {
                ride_started_at : currentDate,
                ride_completed_at : 'On Going Ride',
                ride_estimation_time : '15km',
                ride_rider : riderNameDoc
            }
            const updatedResult = await this.ridesRepository.updateResult(extractedRidesId,payloadUpdate)
            const ackUpdated = clearOffers.acknowledged && updatedResult.acknowledged
            const payloadStatus = {
                offerId
            }
            
            try{
                await publishMessageToRiderStatus(payloadStatus,riderStatusChannel,ridesStatusConfig as IQueueConfig)
            }catch(err){
                uberLogger.error(`Error while publishing to the $`)
            }
            return ackUpdated
        }

    }   
   
    



}

export default new RidesServices()