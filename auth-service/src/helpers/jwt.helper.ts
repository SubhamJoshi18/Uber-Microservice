import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { getEnvValue } from '../utils/getEnv'
import { JsonWebTokenExceptions } from '../exceptions/index'
import { uberLogger } from '../libs/common.logger'
import { IPayloadBody,ServiceEnum } from '../interfaces/auth.interface'

class JsonWebTokenHelper {

    private checkJwtPayload (payload : Omit<IPayloadBody,'phoneNumber'> , options : jwt.SignOptions , accessSecretToken : string | undefined) {
            const validObjects = Object.values(payload).length > 0 && Object.values(options).length > 0
            const validAccessToken = typeof(accessSecretToken) === 'string' && accessSecretToken.length > 0
            return validAccessToken && validObjects
    }

    private getServiceToken (serviceType :  ServiceEnum) {
        switch (serviceType) {
            case ServiceEnum.ACCESS_TOKEN : {
                return getEnvValue('JWT_ACCESS_SECRET_TOKEN')
            }
            case ServiceEnum.REFRESH_TOKEN : {
                return getEnvValue('JWT_REFRESH_SECRET_TOKEN')
            }
            default : {
                return ''
            }
        }
    }


    public async createToken ( payloadBody : Omit<IPayloadBody,'phoneNumber'> , serviceType : ServiceEnum) {
        let processToken = true

        const payload = JSON.parse(JSON.stringify(payloadBody))

        const options : jwt.SignOptions= {
            issuer : 'Uber Shubham',
            expiresIn : serviceType.startsWith("r") ?  '24h' : '1h',
        }

        const accessSecretToken = this.getServiceToken(serviceType)

        return new Promise((resolve,_reject) => {
            try{
                const isValid = this.checkJwtPayload(payload,options,accessSecretToken)
                if(!isValid){
                    processToken = false
                    throw new JsonWebTokenExceptions(`The Provided Credential To Create ${serviceType} Token is not Operational `)
                }
                try{
                    const token = jwt.sign(payload,accessSecretToken as unknown as string,options)
                    if(processToken){
                        resolve(token)
                    }
                }catch(err) {
                    if(err instanceof JsonWebTokenError) {
                        uberLogger.error(`Error , in creating ${serviceType} token , Please Try again to,`)
                        throw err     
                    }
                    throw err
                }
               
            }catch(err){
                throw err
            }
        })
    }
}

export default JsonWebTokenHelper