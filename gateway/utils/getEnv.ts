import dotenv from 'dotenv'
dotenv.config()



const checkKeyExists(key:string) {
    return process.env.hasOwnProperty(key)
}

export const getEnvValue = (key : string) : string => {
return ''
}