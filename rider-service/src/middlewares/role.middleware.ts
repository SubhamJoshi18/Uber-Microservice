import {Request,Response,NextFunction} from 'express'
import statusCodes from 'http-status-codes'
import { USER_VALID_ROLES } from './types'
import { uberLogger } from '../libs/common.logger'



export const validateUserRole = (req:Request,res:Response,next:NextFunction) : any => {
    const extractUserBody = req.user
    console.log(extractUserBody)
    try{
        if('role' in extractUserBody){
            const userRole = req.user.role
            if(USER_VALID_ROLES.USER.includes(userRole)){
                uberLogger.info(`The User is valid, Accessing the API Endpoints`)
                next()
            }else{
                throw new Error(`User Does not match the apporiate route access`)
            }
        }
    }catch(err){
        
        return res.status(statusCodes.BAD_GATEWAY).json({
            message : `The Role Does not match, The ${req.user.role} Does not have the right authorize to access this routes`
        })
    }
}