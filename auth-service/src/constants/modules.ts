import { getEnvValue } from '../utils/getEnv'

const EXPRESS_APP_URL = `http://localhost/:${getEnvValue('PORT')}`
export {
    EXPRESS_APP_URL
}