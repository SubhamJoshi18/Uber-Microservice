import {Router} from 'express'
import RiderController from '../controller/rider.controller'
import { verifyAuthToken } from  '../middlewares/auth.middeware'
import { validateUserRole } from '../middlewares/role.middleware'

const riderRouter = Router()


//Rider Management
riderRouter.post('/rider',verifyAuthToken,RiderController.createRider)
riderRouter.get('/rider',verifyAuthToken,RiderController.getRider)
riderRouter.get('/rider/filter',verifyAuthToken,validateUserRole,RiderController.advanceFilter)


//get by rider id 
riderRouter.delete('/rider/:riderId',verifyAuthToken,RiderController.deleteRiderAccount)
riderRouter.patch('/rider/:riderId',verifyAuthToken,RiderController.updateRiderAccount)



//rider history
riderRouter.get('/rider/history',verifyAuthToken,RiderController.getRiderHistory)
riderRouter.patch('/rider/clear/history',verifyAuthToken,RiderController.clearRiderHistory)



// Rider Report 
riderRouter.post('/rider/report/:riderId',verifyAuthToken,validateUserRole,RiderController.reportRider)
riderRouter.get('/rider/report/:riderId',verifyAuthToken,validateUserRole,RiderController.getRiderReports)



export default riderRouter