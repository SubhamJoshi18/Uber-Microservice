import { getEnvValue } from "./utils/getEnv";
import { convertNumber } from "./utils/transformData";
import MainUserApp from "./app";
import http from 'http'
import { uberLogger } from "./libs/common.logger";
import SingeltonMongoConnection from "./database/connect";
import MainQueueManager from "./queues/mainQueueManager";

const port = convertNumber(getEnvValue('PORT'))?? 3002
const mongoUrl = getEnvValue('MONGO_URL')

const mongoInstance = new SingeltonMongoConnection(mongoUrl as string)
const appInstance = new MainUserApp()


const expressApp = appInstance.getRidesServer()
const server = http.createServer(expressApp as any)

server.listen(port,() => {
    try{
        MainQueueManager.initQueueConsumers().then(() => {
            mongoInstance.getSingeltonConnecition().then(() => {
                uberLogger.info(`Mongo DB is Connected Successfully....`)
                uberLogger.info(`Rides Microservice has been Started on http://localhost:${port}`)
            }).catch((err) => {
                uberLogger.error(`Error Connecting to the MongoDB Database`,err)
            })
        })
    }catch(err){
        uberLogger.error(`Error while starting the Proxy Server For Uber Microservice Backend`,err)
        return // exit the callback function after the error is handled
    }
})

