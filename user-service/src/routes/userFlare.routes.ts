import {Router} from 'express'
import { verifyAuthToken } from '../middlewares/auth.middeware'
import UserFlareController from '../controller/userFlare.controller'

const userFlareRouter = Router()

userFlareRouter.get('/flares',verifyAuthToken,UserFlareController.getAllUserFlares)

export default userFlareRouter