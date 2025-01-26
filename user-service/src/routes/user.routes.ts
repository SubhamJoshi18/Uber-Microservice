import {Router} from 'express'
import UserController from "../controller/user.controller"
import { isValidPrivateUrl } from "../middlewares/route.middleware"
import { verifyAuthToken } from "../middlewares/auth.middeware"

const userRouter : Router = Router()

userRouter.get('/profile', isValidPrivateUrl,verifyAuthToken ,UserController.getUserProfiles)

export default userRouter