import { IRegisterBody } from "../interfaces/auth.interface"
import User from "../database/models/user.models"
import AuthRepository from "../repository/auth.repository"
import { BadExceptions } from "../exceptions/index"
import BcryptHelper from "../helpers/bcrypt.helper"



class AuthService {

    private authRepository : AuthRepository = new AuthRepository()
    private bcryptHelper : BcryptHelper = new BcryptHelper()


    async registerServices  (validBody : Required<IRegisterBody>) : Promise<any> {
        const {email , username, password} = validBody
        
        const promiseArray = await Promise.allSettled([this.authRepository.findOneEmail(email) , this.authRepository.findOneUsername(username)])

        const successPromise = Array.isArray(promiseArray) ? promiseArray.filter((item : any) => item.status !== 'rejected') : []

        if (successPromise.length > 0){
            const failedAttributes = successPromise.map((item:any) => item.value)
            throw new BadExceptions(`The Following Credentials are already created,${[...failedAttributes]} Please Try again`)
        }
        const hashPassword = this.bcryptHelper.hashPassword(password)

        const validPayload = {
            email,
            username,
            password : hashPassword
        }
        return validPayload
    }   
}

export default AuthService