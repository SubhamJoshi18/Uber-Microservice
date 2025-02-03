import { ILoginBody, IRegisterBody, ServiceEnum } from "../interfaces/auth.interface"
import AuthRepository from "../repository/auth.repository"
import { BadExceptions, DatabaseExceptions, ValidationExceptions } from "../exceptions/index"
import BcryptHelper from "../helpers/bcrypt.helper"
import { createUrlToken, get24HoursAheadFormatted, isNullorUndefined, isTrue } from '../utils/transformData'
import { uberLogger } from "../libs/common.logger"
import JsonWebTokenHelper from "../helpers/jwt.helper"
import BlockListRepository from "../repository/blockList.repository"
import { generateRandomUuid } from "../utils/transformData"
import TokenRepository from "../repository/token.repository"
import { sendEmail } from "../libs/smtp.libs"
import { generateHtmlContent, subject } from "../constants/mock"


class AuthService {

    private authRepository : AuthRepository = new AuthRepository()
    private tokenRepository : BlockListRepository = new BlockListRepository()
    private uuidRepository : TokenRepository = new TokenRepository()
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
                 phoneNumber : existsUsername.phoneNumber,
                 role : existsUsername.role
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


    public async logOutServices (token : string) {
        
        const isTokenExists = await this.tokenRepository.findToken(token as string)

        if(isTokenExists || isTokenExists !== null) {
            throw new ValidationExceptions(`The Token Already Exists , Please Try again`)
        }
        const savedResult =  await this.tokenRepository.createToken(token as string)
        
        return {
            status : savedResult.isBlockList,
            message : `The Token Has been Listed On BlockList, Loggin you Out`
        }
    }

    public async forgetPasswordServices ({email} : {email : string}) {

        const isValidEmail =  await Promise.allSettled([this.authRepository.findOneEmail(email as string)])
        
        const isRejectedFree = isValidEmail.every((item : any) => item.status === 'fulfilled')

        if(!isRejectedFree) {
            const rejectedError =  isValidEmail.flatMap((item:any) => item.value)
            throw new DatabaseExceptions(rejectedError[0])
        }

        const emailValue = Array.isArray(isValidEmail) && (isValidEmail[0].status === 'fulfilled' && isValidEmail[0].value !== null )? isValidEmail[0].value : null

        if(!emailValue) {
            throw new DatabaseExceptions(`The email you requested does not exists on the system, Please Try again...`)
        }

        const uuidToken = generateRandomUuid()
        const forwadedDate = get24HoursAheadFormatted()
        const savedDocuments = await this.uuidRepository.createToken(uuidToken,forwadedDate)
        const validUrl = createUrlToken(savedDocuments.token as string,emailValue._id)
        try{
            if(savedDocuments && validUrl.length > 0) { 
                const htmlContent = generateHtmlContent(validUrl)
                    await sendEmail(email,subject,'',htmlContent)
            }
        }catch(err){
            uberLogger.error(`Error Sending Message to the Simple Mail Transfer Protocol..`)
            throw err
        }
        return {
            message : `Reset Password Link is sended Sucessfully on ${validUrl}`
        }
    }


    public async checkResetLink(token : string) {
        const isTokenExists = await this.uuidRepository.findToken(token as string)
        if(!isTokenExists) {
            throw new DatabaseExceptions(`Token Does not exists , Please Try Again`)
        }
        const currentDate = new Date()
        const tokenDate   = new Date(isTokenExists.expiresIn)
        
        const greaterThanCurrentDate=  currentDate > tokenDate
        
        if(greaterThanCurrentDate){
            throw new DatabaseExceptions(`The Token has Already Been Expired , Please Try again with a new Token`)
        }
        return {
            tokenExpirationTime: new Date(isTokenExists.expiresIn)
        }
    }

    public async ResetPassword (userId : any , {password} : {password : string}) {
        
        const userDocument  = await this.authRepository.findOneId(userId as any)
        if(!userDocument){
            throw new DatabaseExceptions(`The User Does not Exist, Please Try again...`)
        }
        const userOldPassword = Object.entries(userDocument).length > 0 ? userDocument.password : ''

        if(userOldPassword.length > 0 && !isNullorUndefined(userOldPassword)) {
                const isMatchOld = await this.bcryptHelper.compareOldPassword(password as string,userOldPassword)
                
                if(isMatchOld){
                    throw new DatabaseExceptions(`The Password You Entered Match with the Old Password ,Try a New Password`)
                }

                const hashPassword = await this.bcryptHelper.hashPassword(password)
                const savedResult = await this.authRepository.saveData({password : hashPassword})
                return savedResult
        }   
        return {
            message : `The Password is not operational or it is invalid, Please Try Again`
        }
    }
}


export default AuthService