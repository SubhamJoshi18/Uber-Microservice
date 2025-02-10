import {Router} from 'express'
import RiderController from '../controller/rider.controller'
import { isValidPrivateUrl } from '../middlewares/route.middleware'
import { verifyAuthToken } from  '../middlewares/auth.middeware'

const riderRouter = Router()


//Rider Management
riderRouter.post('/rider',verifyAuthToken,RiderController.createRider)
riderRouter.get('/rider',isValidPrivateUrl,verifyAuthToken,RiderController.getRider)
riderRouter.get('/rider/filter',isValidPrivateUrl,verifyAuthToken,RiderController.advanceFilter)


//get by rider id 
riderRouter.delete('/rider/:riderId',isValidPrivateUrl,verifyAuthToken,RiderController.deleteRiderAccount)
riderRouter.patch('/rider/:riderId',isValidPrivateUrl,verifyAuthToken,RiderController.updateRiderAccount)



//rider history
riderRouter.get('/rider/history',isValidPrivateUrl,verifyAuthToken,RiderController.getRiderHistory)
riderRouter.patch('/rider/history',isValidPrivateUrl,verifyAuthToken,RiderController.clearRiderHistory)



// Rider Report 
riderRouter.post('/rider/report/:riderId',isValidPrivateUrl,verifyAuthToken,RiderController.reportRider)
riderRouter.get('/rider/reports/:riderId',isValidPrivateUrl,verifyAuthToken,RiderController.getRiderReports)



export default riderRouter