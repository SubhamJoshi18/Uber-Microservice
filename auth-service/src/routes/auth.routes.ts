import {Router} from 'express'
import AuthController from '../controller/auth.controller'
import { isValidPublicUrl } from '../middlewares/route.middleware'


const authRouter  : Router = Router()

authRouter.post('/register',isValidPublicUrl,AuthController.registerUser)


