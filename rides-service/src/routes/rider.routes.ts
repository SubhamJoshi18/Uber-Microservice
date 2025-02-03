import {Router} from 'express'
import { verifyAuthToken } from '../middlewares/auth.middeware'
import { isUser } from '../middlewares/role.middleware'
import RidesController from '../controller/rides.controller'

const ridesRouter = Router()
ridesRouter.post('/rides/create',isUser, verifyAuthToken,RidesController.createRides)


export default ridesRouter