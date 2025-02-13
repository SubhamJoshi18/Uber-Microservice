import {Request,Response,NextFunction} from 'express'
import RiderFlareService from '../services/riderFlare.service'
import { sendApiResposne } from '../utils/genericResponse'
import mongoose from 'mongoose'
import { riderOfferFlareSchema } from '../validations/rider.validation'
import { validateBody } from '../libs/handlers/validator'


class RiderFlareController {

    public async getAllFlares (_req:Request,res:Response,next:NextFunction){
        try{    
            const apiResponse = await RiderFlareService.getAllFlares()
            sendApiResposne(res,apiResponse,`All Currently Available Flares`)
        }catch(err){
            next(err)
        }
    }

    public async offerFlareToUser(req:Request,res:Response,next:NextFunction){
        try{
            const mainUserid = req.user._id
            const userId = req.params.userId
            const ridesId = req.params.ridesId
            const content = req.body
            const coOrdinatiesContent = req.query
            const parseContent = validateBody(content,riderOfferFlareSchema)
            const apiResponse = await RiderFlareService.offerRidesToUser({
                userId :userId as unknown as mongoose.Schema.Types.ObjectId,
                mainUserId : mainUserid as unknown as mongoose.Schema.Types.ObjectId,
                ridesId : ridesId as unknown as mongoose.Schema.Types.ObjectId,
            },parseContent as {offerPrice:number},coOrdinatiesContent as {lat : any,lng:any})
            sendApiResposne(res,apiResponse,`The Offer has been Sended to the User`)
        }catch(err){
            next(err)
        }
    }

}

export default new RiderFlareController()