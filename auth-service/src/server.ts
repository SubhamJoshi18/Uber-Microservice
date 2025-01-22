import { getEnvValue } from "./utils/getEnv";
import { convertNumber } from "./utils/transformData";
import MainAuthApp from "./app";
import http from 'http'
import { uberLogger } from "./libs/common.logger";

const port = convertNumber(getEnvValue('PORT'))?? 3001

const appInstance = new MainAuthApp()
const expressApp = appInstance.getAuthServer()
const server = http.createServer(expressApp as any)

server.listen(port,() => {
    try{
        uberLogger.info(`Auth Microservice has been Started on http://localhost:${port}`)
    }catch(err){
        uberLogger.error(`Error while starting the Proxy Server For Uber Microservice Backend`,err)
        return // exit the callback function after the error is handled
    }
})

