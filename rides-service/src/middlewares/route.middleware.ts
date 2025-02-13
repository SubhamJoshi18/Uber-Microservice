import {Request,Response,NextFunction} from 'express'
import { publicUrl ,privateUrl} from '../config/routes.config'
import { uberLogger } from '../libs/common.logger'
import statusCodes from 'http-status-codes'
import { EXPRESS_APP_URL } from '../constants/modules'

export const isValidPublicUrl = (req:Request,res:Response,next:NextFunction)  : any => {
    let expressUrl = EXPRESS_APP_URL
    const currentUrl = req.url ?? req.originalUrl
  
    const originalParams = expressUrl.concat(`/auth${currentUrl}`)
    const publicWhitlist = Object.values(publicUrl)
    if(publicWhitlist.includes(originalParams)) {
        uberLogger.info(`${currentUrl} is a valid Public Url, Processing the Following Url Request`)
        return next()
    }
    return res.status(statusCodes.NOT_FOUND).json({
        message : `${currentUrl} Does not Exists or It is not a valid Url for Public`
    })
}


export const isValidPrivateUrl = (req:Request,res:Response,next:NextFunction) : any => {
     let expressUrl = EXPRESS_APP_URL
     const currentUrl = req.url ?? req.originalUrl
     const originalParams = expressUrl.concat(`/rider/${currentUrl}`)
     const privateWhitlist = Object.values(privateUrl)

     if(privateWhitlist.includes(originalParams)) {
        uberLogger.info(`${currentUrl} is a valid Private Url for Rider, Processing the following Url Request`)
        return next()
     }

     return res.status(statusCodes.NOT_FOUND).json({
        message : `${currentUrl} Does not Exists or It is not a valid Private Url for Rider`
     })
}