import {Request,Response} from 'express'
import statusCodes from 'http-status-codes'
import { HttpExceptions } from '../exceptions/index'

export default async function errorHandler (err : HttpExceptions, _req:Request, res:Response) {
    const isValidInstance = err instanceof HttpExceptions
    if(isValidInstance) {
            const {status,statusCode,ExceptionName,message} = formatError(err as HttpExceptions)
            return res.status(statusCode).json({
                status,
                statusCode,
                ExceptionName,
                message
            })
    }

    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        status : 'Server Error',
        statusCode: 500,
        ExceptionName: 'Server Error',
        message : `Internal Server Error Working on it....`
    })
}


const formatError = (err : HttpExceptions) => {
    const formattedMessage = {
        status : err.getStatusCode().toString().startsWith('4') ? 'Exceptions' : 'Success',
        statusCode : err.getStatusCode(),
        message : err.getStatusMessage(),
        ExceptionName : err.name
    }
    return formattedMessage
}