import {EXPRESS_APP_URL} from '../constants/modules'



export const publicUrl = {
    register  : `${EXPRESS_APP_URL}/auth/register`,
    login : `${EXPRESS_APP_URL}/auth/login`,
    forgetPassword : `${EXPRESS_APP_URL}/auth/forget-password`
} 


export const privateUrl = {
    createRider : `${EXPRESS_APP_URL}/rider`,
    editRider : `${EXPRESS_APP_URL}/rider`,
    getRiderProfile : `${EXPRESS_APP_URL}/rider`,
    createFlare : `${EXPRESS_APP_URL}/rider/flare`,
    approveFlare : `${EXPRESS_APP_URL}/rider/flare/:flareId`,
    riderHistory : `${EXPRESS_APP_URL}/rider/history`
}