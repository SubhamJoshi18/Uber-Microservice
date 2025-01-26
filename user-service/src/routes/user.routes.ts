import {Router} from 'express'
import UserController from "../controller/user.controller"
import { isValidPrivateUrl } from "../middlewares/route.middleware"
import { verifyAuthToken } from "../middlewares/auth.middeware"
import multer from 'multer'
import {storage} from '../config/multer.config'

const userRouter : Router = Router()
const upload = multer({storage})

userRouter.get('/profile', isValidPrivateUrl,verifyAuthToken ,UserController.getUserProfiles)
userRouter.patch('/profile',isValidPrivateUrl,verifyAuthToken,UserController.updateUserProfile)
userRouter.post('/upload',isValidPrivateUrl,verifyAuthToken,upload.single('photo'),UserController.uploadUserProfilePhoto)
userRouter.delete('/upload',isValidPrivateUrl,verifyAuthToken,UserController.deleteUserProfilePhoto)



export default userRouter