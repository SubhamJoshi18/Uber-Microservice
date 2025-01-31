import {Response} from 'express'
import statusCodes from 'http-status-codes'


export const sendApiResposne = <T>(res:Response, data:T, message : string, statusCode=statusCodes.ACCEPTED) => {
    return res.status(statusCode).json({
        data,
        statusCode,
        message
    })
}