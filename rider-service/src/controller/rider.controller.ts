import {Request,Response,NextFunction} from 'express'
import RiderService from "../services/rider.service"
import { createRiderSchema } from '../validations/rider.validation'
import { validateBody } from  '../libs/handlers/validator'
import { sendApiResposne } from '../utils/genericResponse'
import { IRiderBody } from './types'

class RiderController {


    private riderService : RiderService

    constructor() {
        this.riderService = new RiderService()
    }
    public async createRider (req:Request,res:Response,next:NextFunction) : Promise<any> {
        try{
            const contents = req.body
            const parseBody = validateBody(contents,createRiderSchema)
            const apiResponse = await this.riderService.createRider(parseBody as IRiderBody)
            sendApiResposne(res,apiResponse,`The Rider Has been Successfully Created`)
        }catch(err) {
            next(err)
        }
    }

}


export default new RiderController()