import {Request,Response,NextFunction} from 'express'
import { UserRole } from '../constants/modules'
import statusCodes from 'http-status-codes'

export const isUser = (req:Request,res:Response,next:NextFunction) : any => {
        const userData = req.user
        const isRoleExists = userData.hasOwnProperty('role') ? userData.role : ''
        if(UserRole.includes(isRoleExists)){
            return next()
        }
        return res.status(statusCodes.BAD_GATEWAY).json({
            message : `Only User can Meet the Requirement to use the Rides Services`
        })
}