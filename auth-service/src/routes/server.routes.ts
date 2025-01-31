
import  {Application ,Request,Response} from 'express'
import statusCodes from 'http-status-codes'

export const MainAuthRouter = (expressApp : Application) => {
    
    
    // expressApp.use('/auth',[])


    expressApp.use('*', (req:Request,res:Response) : any => {
         return res.status(statusCodes.NOT_FOUND).json({
            status  : statusCodes.BAD_GATEWAY,
            message : `The Requested ${req.originalUrl} Does not Exists on the System`
        })
    })
}