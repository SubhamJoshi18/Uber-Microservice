import { ILoginBody, IRegisterBody, ServiceEnum } from "../interfaces/auth.interface"
import AuthRepository from "../repository/auth.repository"
import { BadExceptions, DatabaseExceptions } from "../exceptions/index"
import BcryptHelper from "../helpers/bcrypt.helper"
import { isNullorUndefined, isTrue } from '../utils/transformData'
import { uberLogger } from "../libs/common.logger"
import JsonWebTokenHelper from "../helpers/jwt.helper"


class AuthService {

    private authRepository : AuthRepository = new AuthRepository()
    private bcryptHelper : BcryptHelper = new BcryptHelper()
    private jwtHelper : JsonWebTokenHelper = new JsonWebTokenHelper()
    


    async registerServices  (validBody : Required<IRegisterBody>) : Promise<any> {
        const {email , username, password ,phoneNumber} = validBody
        
        const promiseArray = await Promise.allSettled([this.authRepository.findOneEmail(email) , this.authRepository.findOneUsername(username)])

        const successPromise = Array.isArray(promiseArray) ? promiseArray.filter((item : any) => item.value !== null) : []

        if (successPromise.length > 0){
            const failedAttributes = successPromise.map((item:any) => item.value)
            throw new BadExceptions(`The Following Credentials are already created,${[...failedAttributes]} Please Try again`)
        }


        const isRepeatedPhoneNumber = await this.authRepository.findOnePhoneNumber(phoneNumber)

        if(isRepeatedPhoneNumber && isRepeatedPhoneNumber !== null) {
            throw new BadExceptions(`Your ${phoneNumber} is already Registered , Please Try a new Phone Number`)
        }

        const hashPassword = await this.bcryptHelper.hashPassword(password)

        const validPayload = {
            email,
            username,
            password : hashPassword,
            phoneNumber 
        }

        const savedResult = await this.authRepository.savedRegisterData(validPayload)
        return savedResult
    }   


    public async  loginServices (validBody : Required<ILoginBody>) {

        const {username , password} = validBody

        const existsUsername = await this.authRepository.findOneUsername(username as string)

        if(!existsUsername || isNullorUndefined(existsUsername)){
            uberLogger.error(`Username Does not  Exists on this System, Please Try again with a Different Username`)
            throw new DatabaseExceptions(`Username Does not  Exists, Try a existing one`)
        }


        const userPassword =  Object.keys(existsUsername).length > 0 ? existsUsername.password : null

        if(!(isNullorUndefined(userPassword))) {
                
            const isMatch = await this.bcryptHelper.compareHashPassword(password,userPassword as string)

            if(!isTrue(isMatch)){
                throw new DatabaseExceptions(`Password you entered Does not match, Please try again`)
            }

            const payload = Object.freeze({
                 _id : existsUsername._id,
                 username : existsUsername.username,
                 email : existsUsername.email,
                 phoneNumber : existsUsername.phoneNumber
            })

            const accessToken = await this.jwtHelper.createToken(payload,ServiceEnum.ACCESS_TOKEN)
            const refreshToken = await this.jwtHelper.createToken(payload,ServiceEnum.REFRESH_TOKEN)
        
            return {
                accessToken,
                refreshToken,
                data : payload
            }
        }
        return {
            accessToken : null,
            data : {
                message : 'Wrong Bad Gateway or Bad Request'
            }
        }

    }
}

export default AuthService