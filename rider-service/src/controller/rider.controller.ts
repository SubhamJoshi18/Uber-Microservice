import {Request,Response,NextFunction} from 'express'
import RiderService from "../services/rider.service"
import { createRiderSchema } from '../validations/rider.validation'
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
}


export default new RiderController()