import {Request,Response,NextFunction} from 'express'
import UserProfileService from "../services/user.service"
import { sendApiResposne } from '../utils/genericResponse'
import { validateBody } from "../libs/handlers/validator"
import { updateSchemaBody } from '../validations/user.validation'
import { IUploadPhoto } from './types'

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
    public async updateUserProfile(req:Request,res:Response,next:NextFunction) {
            try{
                const userId = req.user._id
                const contents = req.body
                const parseBody = validateBody(contents,updateSchemaBody)
                const apiResponse = await UserProfileService.updateUserProfile(userId,parseBody)
                sendApiResposne(res,apiResponse,`The User has Updated Credential Successfully`)
            }catch(err){
                next(err)
            }
    }

    public async uploadUserProfilePhoto(req:Request,res:Response,next:NextFunction) {
         try{
            const userId = req.user._id
            const contents = req.file
            const apiResponse = await UserProfileService.uploadPhoto(userId,contents as Required<IUploadPhoto>)
            sendApiResposne(res,apiResponse,`The Photo has Been Successfully Uploaded`)
         }catch(err){
            next(err)
         }
    }

    public async deleteUserProfilePhoto(req:Request,res:Response,next:NextFunction) {
        try{
            const userId = req.user._id
            const apiResponse = await UserProfileService.deletePhoto(userId as string)
            sendApiResposne(res,apiResponse,`The User Profile has been Deleted Successfully`)
        }catch(err){
            next(err)
        }
    }


}

export default new  UserController()