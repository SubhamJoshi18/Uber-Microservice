import {Router} from 'express'
import AuthController from '../controller/auth.controller'
import { isValidPublicUrl } from '../middlewares/route.middleware'
import { verifyAuthToken } from "../middlewares/auth.middeware"


const authRouter  : Router = Router()

authRouter.post('/register',isValidPublicUrl,AuthController.registerUser)
authRouter.post('/login',isValidPublicUrl,AuthController.loginUser)
authRouter.post('/logout',verifyAuthToken,AuthController.LogoutUser)
authRouter.post('/forget-password',isValidPublicUrl,AuthController.ForgetPassword)
authRouter.get('/reset-link/:token/:userId',AuthController.CheckPasswordToken)
authRouter.post('/reset-password/:userId',AuthController.ResetPassword)



export default authRouter
