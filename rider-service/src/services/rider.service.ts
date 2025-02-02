import { IRiderBody, IRiderFilter } from '../controller/types'
import RiderRepository from '../repository/rider.repository'
import { DatabaseExceptions } from '../exceptions/index'
import MainQueueManager from '../queues/mainQueueManager'
import { userConfig } from '../config/queue.config'
import { uberLogger } from '../libs/common.logger'
import { IQueueConfig } from '../queues/types'
import { mapRiderAndUser } from '../mappers/rider.mappers'
import mongoose from 'mongoose'
import UserRepository from '../repository/user.repository'
import { checkObjectSize } from '../utils/transformData'


class RiderService  {

    private riderRepository : RiderRepository
    private userRepository : UserRepository
    private amqpServices : MainQueueManager

    constructor(){
        this.riderRepository = new RiderRepository()
        this.amqpServices = new MainQueueManager()
        this.userRepository = new UserRepository()
    }


    public async createRider(parseBody:IRiderBody,userId : string) {
        const { riderName } = parseBody 

        const isRiderExistPromise  = await Promise.allSettled([
            this.riderRepository.findRiderName(riderName as string)
        ])
        const filterRejected =isRiderExistPromise.filter((data : any) => data.status !== 'fulfilled')
        if(Array.isArray(filterRejected) && filterRejected.length > 0) {
            throw new DatabaseExceptions(`There is some issue while Creating the Rider`)
        }
        const isSaved = await this.riderRepository.saveResult(userId as unknown as mongoose.Schema.Types.ObjectId ,{...parseBody})
        try{
            uberLogger.info(`Publishing Payload : ${JSON.stringify(isSaved)} to the ${userConfig['queueName']}`)
            await this.amqpServices.publishMessage(isSaved,userConfig as IQueueConfig)
        }catch(err){
            uberLogger.error(`Error while publishing payload : ${JSON.stringify(isSaved)}`)
            throw err
        }
        return isSaved
    }

    public async getRider(userId : string | mongoose.Schema.Types.ObjectId) {

        const isUserValid = await this.userRepository.getUser(userId as string)

        if(!isUserValid) {
            throw new DatabaseExceptions(`The User Does not Exist or The User is not a Rider`)
        }

        const extractedId = isUserValid !== null ? isUserValid._id : null

        const riderDoc = await this.riderRepository.findRiderUserId(extractedId as unknown as any)

        if(!riderDoc){
            throw new DatabaseExceptions(`The Rider Does not Exists on this Document, Rider Does not Been Created`)
        }

        const mappedResult = mapRiderAndUser(isUserValid,riderDoc)
        return mappedResult
    }

    public async advanceFilter(queryParams : IRiderFilter){
        const filterArray : any = []
        if(!(checkObjectSize(queryParams))) {
            uberLogger.info(`Query Params have Empty Properties, Giving Everything`)
            const allResponse =  await this.riderRepository.findAllRider()
            return allResponse
        }

        for (let [key,value] of Object.entries(queryParams)) {
            const paramsPayload = {
            }
            if(!(key in paramsPayload)) {
                paramsPayload[key] = value
                filterArray.push(paramsPayload)
            }else{
                continue
            }
        }
        const isValidArray = Array.isArray(filterArray) && filterArray.length > 0
        
        if(!isValidArray) {
            uberLogger.info(`The Query Params Array is Empty, Reverting to get All Rider Services`)
            const emptyQueryParams = {}
            return this.advanceFilter(emptyQueryParams as {} as any)
        }
        const filterdResutt = await this.riderRepository.getFilter(filterArray)
        return filterdResutt
    }


}


export default RiderService