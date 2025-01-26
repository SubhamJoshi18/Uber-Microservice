import {EXPRESS_APP_URL} from '../constants/modules'



export const publicUrl = {
    register  : `${EXPRESS_APP_URL}/auth/register`,
    login : `${EXPRESS_APP_URL}/auth/login`,
    forgetPassword : `${EXPRESS_APP_URL}/auth/forget-password`
}


export const privateUrl = {
    getProfile : `${EXPRESS_APP_URL}/user/profile`,
    editProfile : `${EXPRESS_APP_URL}/user/profile`,
} as const