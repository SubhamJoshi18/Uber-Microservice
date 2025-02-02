import {Request,Response,NextFunction} from 'express'
import RiderService from "../services/rider.service"
import { createRiderSchema, riderReportSchema, updatedRiderSchema } from '../validations/rider.validation'
import { validateBody } from  '../libs/handlers/validator'
import { sendApiResposne } from '../utils/genericResponse'
import { IRiderBody, IRiderFilter } from './types'

class RiderController {


    private riderService : RiderService

    constructor() {
        this.riderService = new RiderService()
    }
    public async createRider (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const contents = req.body
            const parseBody = validateBody(contents,createRiderSchema)
            const apiResponse = await this.riderService.createRider(parseBody as IRiderBody,userId)
            sendApiResposne(res,apiResponse,`The Rider Has been Successfully Created`)
        }catch(err) {
            next(err)
        }
    }
    public async getRider(req:Request,res:Response,next:NextFunction) : Promise<any> {
         try{
            const userId = req.user._id
            const apiResponse = await this.riderService.getRider(userId)
            sendApiResposne(res,apiResponse,`The Rider Profile Successfully Fetches`)
         }catch(err) {
            next(err)
         } 
    }
    public async advanceFilter(req:Request,res:Response,next:NextFunction) : Promise<any> {
         try{
            const queryParams = req.query
            const apiResponse = await this.riderService.advanceFilter(queryParams as unknown as IRiderFilter)
            sendApiResposne(res,apiResponse,`The Filter Result has been Successfully Fetches`)
         }catch(err){
            next(err)
         }
    }
    public async deleteRiderAccount (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const apiResponse = await this.riderService.deleteRiderAccount(userId)
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
            const apiResponse = await this.riderService.updateRiderService(riderId as unknown as any,parseBody as {riderName : string})
            sendApiResposne(res,apiResponse,`The Rider Account has been Updated`)
        }catch(err){
            next(err)
        }
    }

    public async reportRider (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const riderId = req.params.riderId
            const contents = req.body
            const parseComment = validateBody(contents,riderReportSchema)
            const apiResponse = await this.riderService.reportRider(riderId as unknown as any,parseComment as {riderComment : string})
            sendApiResposne(res,apiResponse,`The Rider has been Reported Successfully`)
        }catch(err){
            next(err)
        }
    }


    public async getRiderReports(req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const riderId = req.params.riderId
            const apiResponse = await this.riderService.getRiderReport(riderId as unknown as any)
            sendApiResposne(res,apiResponse,`The Rider Report History is Fetches`)
        }catch(err){
            next(err)
        }
    }

    public async getRiderHistory (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId  = req.user._id
            const apiResponse = await this.riderService.getRiderHistory(userId as string)
            sendApiResposne(res,apiResponse,`The Rider History`)        
        }catch(err){
            next(err)
        }
    }

    public async clearRiderHistory (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const apiResponse = await this.riderService.clearRiderHistory(userId as string)
            sendApiResposne(res,apiResponse,`The Histry has been cleared`)
        }catch(err){
            next(err)
        }
    }
}


export default new RiderController()