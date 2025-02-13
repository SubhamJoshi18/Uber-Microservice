import {Request,Response,NextFunction} from 'express'
import UserFlareService from '../services/userFlare.service'
import { sendApiResposne } from '../utils/genericResponse'

class UserFlareController {

    public async getAllUserFlares(req:Request,res:Response,next:NextFunction){
        try{
            const userId = req.user._id
            const apiResponse = await UserFlareService.getAllFlares(userId)
            sendApiResposne(res,apiResponse,`The All Flare for the User has been Fetches`)
        }catch(err){
            next(err)
        }
    }

}


export default new UserFlareController()