import { IMicroServiceConfig } from "./types"
import  {userUrl,riderUrl,ridesUrl,authUrl} from '../constants/constants'

export const microServicesConfig  : IMicroServiceConfig= {
    user : userUrl,
    auth: authUrl,
    rider : riderUrl,
    rides :riderUrl
}