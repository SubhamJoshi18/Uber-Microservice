import {Request,Response,NextFunction} from 'express'
import { publicUrl } from '../config/routes.config'
import { uberLogger } from '../libs/common.logger'
import statusCodes from 'http-status-codes'

export const isValidPublicUrl = (req:Request,res:Response,next:NextFunction)  : any => {
    const currentUrl = req.url ?? req.originalUrl
    if(Object.values(publicUrl).includes(currentUrl)) {
        uberLogger.info(`${currentUrl} is a valid Public Url, Processing the Following Url Request`)
        next()
    }
    return res.status(statusCodes.NOT_FOUND).json({
        message : `${currentUrl} Does not Exists or It is not a valid Url for Public`
    })
}
