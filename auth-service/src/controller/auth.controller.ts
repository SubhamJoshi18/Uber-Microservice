import type , {Request,Response,NextFunction} from 'express'
import {loginSchemaBody} from '../validations/auth.validation'
import {registerUserSchema} from '../validations/auth.validation'
import { validateBody } from '../libs/handlers/validator'

class AuthController {
    
    public registerUser = async (req : Request,res : Response,next : NextFunction) => {
            try{
                const content = req.body
                const parseBody = validateBody(content,registerUserSchema)
                
                


            }catch(err){
                    next(err)
            }
    }

    public loginUser = async (req:Request,res:Response,next:NextFunction) => {
        try{
            const content = req.body
            const parseBody = validateBody(content,loginSchemaBody)

        }catch(err){
            next(err)
        }
    }
}


export default new AuthController()