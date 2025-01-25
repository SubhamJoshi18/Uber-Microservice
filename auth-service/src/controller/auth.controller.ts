import  {Request,Response,NextFunction} from 'express'
import {loginSchemaBody} from '../validations/auth.validation'
import {registerUserSchema} from '../validations/auth.validation'
import { validateBody } from '../libs/handlers/validator'
import AuthService from "../services/auth.services"
import { ILoginBody, IRegisterBody } from '../interfaces/auth.interface'
// import statusCodes from 'http-status-codes'
import { sendApiResposne } from '../utils/genericResponse'


class AuthController {

    private authServices : AuthService
    
    constructor() {
        this.authServices = new AuthService()
    }
    
    public registerUser = async (req : Request,res : Response,next : NextFunction) : Promise<void> => {
            try{
                const content = req.body
                const parseBody = validateBody(content,registerUserSchema)
                const apiResposne  = await this.authServices.registerServices(parseBody as object as IRegisterBody)
                sendApiResposne(res,apiResposne,`Registered SuccessFully Completed`)
            }catch(err){
                    next(err)
            }
    }

    public loginUser = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
        try{
            const content = req.body
            const parseBody = validateBody(content,loginSchemaBody)
            const apiResponse = await this.authServices.loginServices(parseBody as ILoginBody)
            sendApiResposne(res,apiResponse,`Login Successfully Completed`)
        }catch(err){
            next(err)
        }
    }

    public LogoutUser = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
            try{
                const accessToken = req.user.accessToken
                const apiResponse = await this.authServices.logOutServices(accessToken as string)
                sendApiResposne(res,apiResponse,`Log out Successfully`) 
            }catch(err){
                next(err)
            }
    }
}


export default new AuthController()