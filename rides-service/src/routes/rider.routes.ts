import {Router} from 'express'
import { verifyAuthToken } from '../middlewares/auth.middeware'
import { isUser } from '../middlewares/role.middleware'
import RidesController from '../controller/rides.controller'

const ridesRouter = Router()

ridesRouter.post('/rides/create', verifyAuthToken,isUser,RidesController.createRides)
ridesRouter.patch('/rides/accept',verifyAuthToken,isUser,RidesController.acceptOffer)
ridesRouter.get('/rides/:ridesId',verifyAuthToken,RidesController.getAllRidesOffer)


export default ridesRouter