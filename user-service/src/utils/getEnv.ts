import dotenv from 'dotenv'
dotenv.config()

const checkKeyExists = (key:string) : boolean  => {
    return process.env.hasOwnProperty(key)
}

export const getEnvValue = (key : string) : string | undefined=> {
    return checkKeyExists(key) ? process.env[key] : ' '
}
