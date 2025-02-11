import {Request,Response,NextFunction} from 'express'
import RiderService from "../services/rider.service"
import { createRiderSchema, updatedRiderSchema } from '../validations/rider.validation'
import { validateBody } from  '../libs/handlers/validator'
import { sendApiResposne } from '../utils/genericResponse'
import { IRiderBody, IRiderFilter } from './types'

class RiderController {



    public async createRider (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const contents = req.body
            const parseBody = validateBody(contents,createRiderSchema)
            const apiResponse = await RiderService.createRider(parseBody as IRiderBody,userId)
            sendApiResposne(res,apiResponse,`The Rider Has been Successfully Created`)
        }catch(err) {
            next(err)
        }
    }
    public async getRider(req:Request,res:Response,next:NextFunction) : Promise<any> {
         try{
            const userId = req.user._id
            const apiResponse = await RiderService.getRider(userId)
            sendApiResposne(res,apiResponse,`The Rider Profile Successfully Fetches`)
         }catch(err) {
            next(err)
         } 
    }
    public async advanceFilter(req:Request,res:Response,next:NextFunction) : Promise<any> {
         try{
            const queryParams = req.query
            const apiResponse = await RiderService.advanceFilter(queryParams as unknown as IRiderFilter)
            sendApiResposne(res,apiResponse,`The Filter Result has been Successfully Fetches`)
         }catch(err){
            next(err)
         }
    }
    public async deleteRiderAccount (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const apiResponse = await RiderService.deleteRiderAccount(userId)
            sendApiResposne(res,apiResponse,`The Rider has been Deleted`)
        }catch(err){
            next(err)
        }
    }

    public async updateRiderAccount (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const riderId = req.params.riderId
            const contents = req.body
            const parseBody = validateBody(contents,updatedRiderSchema)
            const apiResponse = await RiderService.updateRiderService(riderId as unknown as any,parseBody as {riderName : string})
            sendApiResposne(res,apiResponse,`The Rider Account has been Updated`)
        }catch(err){
            next(err)
        }
    }

    public async reportRider (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const riderId = req.params.riderId
            const contents = req.body
            const apiResponse = await RiderService.reportRider(riderId as unknown as any,contents as {reportComment : string})
            sendApiResposne(res,apiResponse,`The Rider has been Reported Successfully`)
        }catch(err){
            next(err)
        }
    }


    public async getRiderReports(req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const riderId = req.params.riderId
            const apiResponse = await RiderService.getRiderReport(riderId as unknown as any)
            sendApiResposne(res,apiResponse,`The Rider Report History is Fetches`)
        }catch(err){
            next(err)
        }
    }

    public async getRiderHistory (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId  = req.user._id
            const apiResponse = await RiderService.getRiderHistory(userId as string)
            sendApiResposne(res,apiResponse,`The Rider History`)        
        }catch(err){
            next(err)
        }
    }

    public async clearRiderHistory (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const apiResponse = await RiderService.clearRiderHistory(userId as string)
            sendApiResposne(res,apiResponse,`The History has been cleared`)
        }catch(err){
            next(err)
        }
    }
}


export default new RiderController()