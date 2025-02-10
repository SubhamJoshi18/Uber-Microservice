import {EXPRESS_APP_URL} from '../constants/modules'



export const publicUrl = {
    register  : `${EXPRESS_APP_URL}/auth/register`,
    login : `${EXPRESS_APP_URL}/auth/login`,
    forgetPassword : `${EXPRESS_APP_URL}/auth/forget-password`
} 


export const privateUrl = {
    createRider : `${EXPRESS_APP_URL}/api/rider`,
    editRider : `${EXPRESS_APP_URL}/api/rider`,
    getRiderProfile : `${EXPRESS_APP_URL}/api/rider`,
    createFlare : `${EXPRESS_APP_URL}/api/rider/flare`,
    approveFlare : `${EXPRESS_APP_URL}/api/rider/flare/:flareId`,
    riderHistory : `${EXPRESS_APP_URL}/api/rider/history`
}