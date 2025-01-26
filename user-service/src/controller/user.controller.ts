import {Request,Response,NextFunction} from 'express'
import UserProfileService from "../services/user.service"
import { sendApiResposne } from '../utils/genericResponse'


class UserController {


    public async getUserProfiles(req:Request,res:Response,next:NextFunction) {
        try{
             const userId = req.user._id
             const apiResponse = await UserProfileService.getUserProfileService(userId as string)
             sendApiResposne(res,apiResponse,`The User Profile is Fetches Successfully`)
        }catch(err){
            next(err)
        }
    }


}

export default new  UserController()