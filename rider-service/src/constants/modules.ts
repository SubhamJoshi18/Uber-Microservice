import { getEnvValue } from '../utils/getEnv'

const EXPRESS_APP_URL = `http://localhost/:${getEnvValue('PORT')}`

const MIMETYPE = ['png']

export {
    EXPRESS_APP_URL,
    MIMETYPE
}