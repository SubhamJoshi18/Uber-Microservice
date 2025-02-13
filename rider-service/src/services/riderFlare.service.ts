
import { DatabaseExceptions } from '../exceptions/index'
import UserFlareRepository from '../repository/userFlare.repository'
import UserRepository from '../repository/user.repository'
import { extractAndMapOffer, prepareDataForDb } from '../extractor/riderExtractor'
import RiderRepository from '../repository/rider.repository'
import MainQueueManager from '../queues/mainQueueManager'
import { offerFlareConfig } from '../config/queue.config'
import { uberLogger } from '../libs/common.logger'
import { publishOfferToUser } from '../queues/producer/offerPublisher'
import { IQueueConfig } from '../queues/types'
import RiderOfferRepository from '../repository/riderOffer.repository'


class RiderFlareService {

    private userFlareRepository : UserFlareRepository
    private userRepository : UserRepository
    private riderRepository : RiderRepository
    private offerRiderRepository : RiderOfferRepository

    constructor(){
        this.userFlareRepository = new UserFlareRepository()
        this.userRepository = new UserRepository()
        this.riderRepository = new RiderRepository()
        this.offerRiderRepository = new RiderOfferRepository()
    }

    public async getAllFlares(){
        const responses = await this.userFlareRepository.getAll()
        if(Array.isArray(responses) && responses.length === 0){
            throw new DatabaseExceptions(`There is not any Flare Currently Available Right now`)
        }
        return responses
    }

    public async offerRidesToUser(userIdObj : {userId : any, mainUserId : any},parseContent : {offerPrice:number},coOrdinatiesContent){
        const { offerPrice } = parseContent

        const offerFlareChannel = await MainQueueManager.createGenericChannel(offerFlareConfig)
        
        const userContent = await this.userRepository.getUser(userIdObj.userId as unknown as string)

        if(!userContent){
            throw new DatabaseExceptions(`There is no User That you are offering from`)
        }

        const riderUserContent = await this.userRepository.getUser(userIdObj.mainUserId as unknown as string)

        const isUserRider = riderUserContent?.rider ?  riderUserContent.rider._id : ''

        const riderDoc = await this.riderRepository.findRiderById(isUserRider)

        if(!riderDoc){
            throw new DatabaseExceptions(`User is not a valid Rider, Cannot make the Offer`)
        }
       
       
        const promiseArray = await Promise.allSettled([this.userFlareRepository.getFlareByUser(userIdObj.userId)])
        
        const filterRejection = promiseArray.filter((data:any) => data.status !== 'fulfilled')
        
        if(Array.isArray(filterRejection) && filterRejection.length > 0){
            throw new DatabaseExceptions(`There is an error ,The Flare Created by the User Does not Exists`)   
        }

        const extractedPayload = promiseArray.length > 0 ? promiseArray.map((data:any) => {
            if(data.status === 'fulfilled'){
                return data.value
            }
        }).pop() : []

        const userFlare = extractedPayload.userFlarePrice   

        const isSamePrice = Math.ceil(offerPrice) === Math.ceil(userFlare)
       
        if(isSamePrice){
            throw new DatabaseExceptions(`The Offer Price and User Flare is same, Increase the Offer Price`)
        }

        const validGemoetry = coOrdinatiesContent.hasOwnProperty('lat') && coOrdinatiesContent.hasOwnProperty('lng')
        
        if(!validGemoetry){
            throw new DatabaseExceptions(`The Rider does not have appropriate Lat and lng Gemoetry, Cannot find the rider current location`)
        }

        const extendedPayload = Object.assign(coOrdinatiesContent,{riderName : riderDoc.riderName, riderId : riderDoc._id})

        uberLogger.info(`Mapping the Co ordinates payload with the Rides Payload`)

        const mappedPayload = extractAndMapOffer(Object.assign(extractedPayload,extendedPayload),offerPrice)

        try{
            await publishOfferToUser(offerFlareChannel,offerFlareConfig as IQueueConfig,mappedPayload)
        }catch(err){
            uberLogger.error(`Error publishing the message : ${JSON.stringify(mappedPayload)} to the ${offerFlareConfig['queueName']}`)
            return
        }

        const preparedData  = Object.assign(prepareDataForDb(mappedPayload,extendedPayload),{userId : userIdObj.userId})

        const savedResult = await this.offerRiderRepository.publishRiderOfferToDb(preparedData,offerPrice)
        return savedResult
    }

}   


export default new RiderFlareService()