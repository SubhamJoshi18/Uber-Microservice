
import  {Application ,Request,Response} from 'express'
import statusCodes from 'http-status-codes'
import errorHandler from '../middlewares/error.middleware'
import riderRouter from './rider.routes'
import riderFlareRouter from './riderFlare.routes'

export const MainRiderRouter = (expressApp : Application) => {
    
    expressApp.use('/api',[riderRouter,riderFlareRouter])
    
    expressApp.use(errorHandler as any)
    
    expressApp.use('*', (req:Request,res:Response) : any => {
         return res.status(statusCodes.NOT_FOUND).json({
            status  : statusCodes.BAD_GATEWAY,
            message : `The Requested ${req.originalUrl} Does not Exists on the System`
        })
    })

 
}