import {Router} from 'express'
import RiderFlareController from '../controller/riderFlare.controller'
import { verifyAuthToken } from '../middlewares/auth.middeware'
const riderFlareRouter = Router()

riderFlareRouter.get('/rider/flare',verifyAuthToken,RiderFlareController.getAllFlares)
export default riderFlareRouter