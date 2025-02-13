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

    public async acceptOffer(req:Request,res:Response,next:NextFunction){
        try{
           
        }catch(err){
           next(err)
        }
   }

    public async cancelOffer(req:Request,res:Response,next:NextFunction){
        try{
        
        }catch(err){
        next(err)
        }
    }

    public async startRide(req:Request,res:Response,next:NextFunction){
        try{
        
        }catch(err){
        next(err)
        }
    }

    public async completeRide(req:Request,res:Response,next:NextFunction){
        try{
        
        }catch(err){
        next(err)
        }
    }

}


export default new RidesController()