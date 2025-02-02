import {Router} from 'express'
import RiderController from '../controller/rider.controller'
import { isValidPrivateUrl } from '../middlewares/route.middleware'
import { verifyAuthToken } from  '../middlewares/auth.middeware'

const riderRouter = Router()

riderRouter.post('/rider',isValidPrivateUrl,verifyAuthToken,RiderController.createRider)
riderRouter.get('/rider',isValidPrivateUrl,verifyAuthToken,RiderController.getRider)
riderRouter.get('/rider/filter',isValidPrivateUrl,verifyAuthToken,RiderController.advanceFilter)


export default riderRouter