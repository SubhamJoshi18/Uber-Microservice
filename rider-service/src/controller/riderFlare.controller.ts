import {Request,Response,NextFunction} from 'express'
import RiderFlareService from '../services/riderFlare.service'
import { sendApiResposne } from '../utils/genericResponse'


class RiderFlareController {

    public async getAllFlares (_req:Request,res:Response,next:NextFunction){
        try{    
            const apiResponse = await RiderFlareService.getAllFlares()
            sendApiResposne(res,apiResponse,`All Currently Available Flares`)
        }catch(err){
            next(err)
        }
    }

}

export default new RiderFlareController()