

export interface IRegisterBody {
    username : string
    password : string
    email : string   
    phoneNumber
}



export interface IPayloadBody {
    _id : any
    username : string
    email : string
    phoneNumber : string
}

export enum ServiceEnum {
    ACCESS_TOKEN = 'accesstoken',
    REFRESH_TOKEN = 'refreshtoken'
}
