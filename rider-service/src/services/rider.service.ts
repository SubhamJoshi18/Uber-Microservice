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
import { checkObjectSize, isTrue } from '../utils/transformData'
import RiderReportRepository from '../repository/riderReport.repository'



class RiderService  {

    private riderRepository : RiderRepository
    private userRepository : UserRepository
    private amqpServices : MainQueueManager
    private riderReportRepository : RiderReportRepository

    constructor(){
        this.riderRepository = new RiderRepository()
        this.amqpServices = new MainQueueManager()
        this.userRepository = new UserRepository()
        this.riderReportRepository = new RiderReportRepository()
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

    public async deleteRiderAccount(userId : mongoose.Schema.Types.ObjectId) {

        const isValidPromise = await Promise.allSettled([
            this.userRepository.getUser(userId as any),
            this.riderRepository.findRiderUserId(userId as any)
        ])

        const filteredRejectedPromise = Array.isArray(isValidPromise) ? isValidPromise.filter((data : any) => data.status !== 'fulfilled') : [{status:'rejected'}]

        const errorExists = filteredRejectedPromise.length > 0

        if(errorExists) {
            throw new DatabaseExceptions(`The User Id : ${userId} Does not Exists neither on User System or Rider System, Enter Appropriate User Id`)
        }

        const extractedUserDetails : any = !filteredRejectedPromise.length.toString().startsWith('0') && isValidPromise[0]['status'] === 'fulfilled' ? isValidPromise[0]['value'] :[ ]
        
        const extractedRiderDetails : any = !filteredRejectedPromise.length.toString().startsWith('0') && isValidPromise[1]['status'] === 'fulfilled' ? isValidPromise[1]['value'] : []

        const checkRiderActive = extractedRiderDetails.isActiveRider

        if(!(isTrue(checkRiderActive))) {
            throw new DatabaseExceptions(`The Rider you are trying to Delete is not active, Please Active First`)
        }   

        const userRiderId = extractedRiderDetails.hasOwnProperty('rider') ? extractedUserDetails.rider : null


        const removeRiderFromUser = await this.userRepository.removeUserRider(userId as unknown as any)
        
        const removeResult = await this.riderRepository.deleteRider(userRiderId as unknown as any)

        const isvalidUpdated  = removeRiderFromUser.acknowledged && removeRiderFromUser.modifiedCount > 0

        const isvalidDeleted = removeResult.acknowledged && removeResult.deletedCount > 0 

        return isvalidDeleted && isvalidUpdated ? {
            message : `The Rider Has been Removed From our System`,
        } :  {
            message : `There is some issue while Deleting the Rider`
        }
    }

    public async reportRider(riderId : mongoose.Schema.Types.ObjectId, comments : {riderComment : string}){
    
        const riderExists = await this.riderRepository.findRiderById(riderId as unknown as any)

        if(typeof riderExists === 'object' && !riderExists) {
            uberLogger.info(`Rider Document is null, Or it does not exists on the  System`)
            throw new DatabaseExceptions(`The Rider You are Trying to Report Does not Exists`)
        }
        
        const riderComment = Object.entries(comments).length > 0 ? comments.riderComment : ''
        const checkReportExists = riderExists.riderReport !== null ? riderExists.riderReport : null
        
        if(!checkReportExists) {
            uberLogger.info(`The Rider Has Not Received any Report till now, Publishing One Report to the Report`)
            const reportRider = await this.riderReportRepository.publishReport(riderId as unknown as any,riderComment)
            const reportedRiderId = reportRider.hasOwnProperty('_id') ?reportRider._id : null
            const savedReportedId = await this.riderRepository.pushRiderReportedIdToRider(riderId as unknown as any,reportedRiderId)
            return savedReportedId
        }
        uberLogger.info(`The Rider has already raise a ticket or has been reported`)
        
        const totalReported =  riderExists.riderReport ? riderExists.riderReport.length : 0

        const isMaximumReported = totalReported.toString().startsWith('20')

        if(isMaximumReported) {
            throw new DatabaseExceptions(`The Rider you are trying to Report already meet the maximum report limit, we are trying to figuring out to banned him`)
        }

        const reportedRider = await this.riderReportRepository.publishReport(riderId as unknown as any,riderComment)
        const reportedRiderId = reportedRider.hasOwnProperty('_id') ?reportedRider._id : null
        const savedReportedId = await this.riderRepository.pushRiderReportedIdToRider(riderId as unknown as any,reportedRiderId)
        return savedReportedId
    }


    public async getRiderReport (riderId : string) {
        const riderExists = await this.riderRepository.findRiderById(riderId as string)
        if(!riderExists) {
            uberLogger.info(`Rider Document is null, Or it does not exists on the  System`)
            throw new DatabaseExceptions(`The Rider You are Trying to Report Does not Exists`)
        }
        const isReportedExists = !riderExists.riderReport 
        const isReportExceeded = riderExists.riderReport && riderExists.riderReport.length.toString().startsWith('20')
        if(isTrue(isReportedExists) || isTrue(isReportExceeded)) {
            throw new DatabaseExceptions(`The Rider Does not Have the Report Property`)
        }
        
        const totalReport = riderExists.riderReport.length
        const payload = {
            riderReports : riderExists.riderReport.filter((data : any ) => data.reportComment.trim().length > 0).map((trimData:any) => {
                return {
                    comments : trimData.reportComment,
                }
            }),
            totalReports : totalReport
        }
        return payload
    }


    public async getRiderHistory (userRiderId : any) {

        const validPromiseValidation = await Promise.allSettled([
            this.userRepository.getUser(userRiderId as string),
            this.riderRepository.findRiderUserId(userRiderId as string)
        ])


        const filteredRejectedPromise = Array.isArray(validPromiseValidation) && validPromiseValidation.filter((data:any) => data.status !== 'fulfilled').length > 0
        
        if(filteredRejectedPromise) {
            throw new DatabaseExceptions(`The User Id Does not match with the Rider Id, or The ${userRiderId} Does not have any Rider Associated with it`)
        }

        const extractedRider : any = validPromiseValidation.length > 0 &&  validPromiseValidation[1]['status'] === 'fulfilled' ? validPromiseValidation[1]['value'] : {}

        if(!checkObjectSize(extractedRider as unknown as object)){ 
            throw new DatabaseExceptions(`The User Does not have Rider Associated with it`)
        }

        const isHistoryValid = extractedRider.hasOwnProperty('_id') && extractedRider.riderHistory === 0 ? extractedRider.riderExists : [];

        if(isHistoryValid.length.toString().startsWith('0')) {
            return {
                message : `The User does not have the Riding History`,
                history : isHistoryValid
            }
        }

        const mappedResult = extractedRider.riderHistory.map((data:any) => {
            return {
                userId : data._id,
                username : data.username,
                userNumber : data.phoneNumber
            }
        })


        return {
            message : `Rider history Have Been Fetches`,
            totalRiderHistory : mappedResult.length,
            history : mappedResult
        }

    }


    public async clearRiderHistory (riderId:string){

        const riderDocuments = await this.riderRepository.findRiderUserId(riderId as string)

        if(typeof riderDocuments === 'object' && !riderDocuments) {
            throw new DatabaseExceptions(`The Rider Does not Exists , Error clearing the History`)
        }

        const isExistsHistory = riderDocuments.hasOwnProperty('_id') ? riderDocuments.riderHistory : []
        
        const isValidHistory = Array.isArray(isExistsHistory) && isExistsHistory.length.toString().startsWith('0')

        if(isValidHistory){
            throw new DatabaseExceptions(`Rider History does not Exists, Please Verify if this is the Correct Rider`)
        }


        const isAlreadyZero = isExistsHistory.length.toString().startsWith('0')

        if(isAlreadyZero){
            return {
                message : `Rider Does not have A History`,
                history : []
            }
        }



        const clearRiderResult = await this.riderRepository.clearRiderHistory(riderId as unknown as any)
        
        const isValidUpdated = clearRiderResult.acknowledged && clearRiderResult.modifiedCount > 0

        return isValidUpdated ? {
            message : `Rider History has been Cleared Successfully`,
            history : []
        } :  {
            message : `There is some issue while clearing the Rider History`,
            history : null
        }

    }

    public async updateRiderService (riderId : any, parseBody : {riderName : string}) { 
        const existsRiderDoc = await this.riderRepository.findRiderById(riderId as string)

        if(Object.entries(existsRiderDoc as object).length === 0 || !existsRiderDoc) {
            throw new DatabaseExceptions(`The Rider Does not Exists`)
        }
        const parsePayload = typeof(parseBody) === 'object' && Object.entries(parseBody).length > 0 ? JSON.parse(JSON.stringify(parseBody)) : null

        if(!parsePayload) {
            throw new DatabaseExceptions(`The Updated Field does not match with the Javascript Object`)
        }

        const updatedRider = await this.riderRepository.updateRider(riderId as string,{...parsePayload} as unknown as {riderName : string})
        return updatedRider.acknowledged && updatedRider.modifiedCount > 0 ?  {message : `The Rider has been Updated Successfully`} : {message : `The Rider is facing issue while updating it`}
    }

}


export default RiderService