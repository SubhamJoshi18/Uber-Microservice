import {Request,Response,NextFunction} from 'express'
import { createRidesSchema } from '../validations/rides.validation'
import { validateBody } from '../libs/handlers/validator'
import RidesServices from '../services/rides.service'
import { ICreateRider,userMongoId } from './types'
import { sendApiResposne } from '../utils/genericResponse'


class RidesController {


    public async createRides(req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const userId = req.user._id
            const content = req.body
            const parseContent = validateBody(content,createRidesSchema)
            const apiResponse = await RidesServices.createRideServices(userId as userMongoId, parseContent as ICreateRider)
            sendApiResposne(res,apiResponse,`The Ride has been Requested`)
        }catch(err){
            next(err)
        } 
    }
    public async getAllRidesOffer(req:Request,res:Response,next:NextFunction){
        try{    
            const ridesId = req.params.ridesId
            const apiResponse = await RidesServices.getAllRidesOffer(ridesId)
            sendApiResposne(res,apiResponse,`The Rides has been Started`)
        }catch(err){
           next(err)
        }
   }

   public async acceptOffer(req:Request,res:Response,next:NextFunction){
        try{
            const userId = req.user._id
            const offerId = req.params.offerId
            const ridesId = req.params.ridesId
            const idsobj = {
                userId,
                offerId,
                ridesId
            }
            const apiResponse = await RidesServices.acceptOffer(idsobj)
            sendApiResposne(res,apiResponse,`The Ride has begin`)
            

        }catch(err){
            next(err)
        }
   }
}


export default new RidesController()