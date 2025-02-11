import {Router} from 'express'
import { verifyAuthToken } from '../middlewares/auth.middeware'
import { isUser } from '../middlewares/role.middleware'
import RidesController from '../controller/rides.controller'

const ridesRouter = Router()
ridesRouter.post('/rides/create', verifyAuthToken,isUser,RidesController.createRides)


export default ridesRouter