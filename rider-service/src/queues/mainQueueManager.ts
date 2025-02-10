import  amqp , {Connection,Channel} from 'amqplib'
import { AMQPConnectionExcepitions } from '../exceptions/index'
import { uberLogger } from '../libs/common.logger'
import { getEnvValue } from '../utils/getEnv'
// import {IQueueConfig } from './types'
import { createGenericChannel } from './createGenericChannel'
import initQueueConsumer from './initQueueConsumer'


class MainQueueManager {



    constructor() {

    }
    
    public static async createAmqpConnection () : Promise<any> {
        let  connection : Connection
        let  channel : Channel
        let retryCount = 0
        let retryStatus= true
        const url = getEnvValue('AMQP_URL')
        while(retryCount < 4 && typeof retryStatus === 'boolean' && retryStatus) {
            try{
                connection = await amqp.connect(url as string)
                channel = await connection.createChannel()
                return {
                    connection,channel
                }
            }catch(err){
                console.log(err)
                if(err instanceof AMQPConnectionExcepitions) {
                    uberLogger.error(`[AMQP] Connection Error Deteced`,err.message)
                    return
                    
                }
                const isValidCount = retryCount < 4
                if (isValidCount) {
                    uberLogger.error(`An Unexpected Error has been En-countered, Retrying the Connection`)
                    retryCount += 1
                    continue
                }
                uberLogger.error(`Maximum Retry has been utilized, Please Try again Later`)
                return 
                
            }
        }
    }

    public static async createGenericChannel(queueConfig : object){
        const {connection , channel} : {connection : Connection, channel : Channel} | any = await this.createAmqpConnection()
        uberLogger.info(`The Channel Has been Created For ${queueConfig['queueName']}`,connection)
        const genericChannel = createGenericChannel({channel},queueConfig as any)
        return genericChannel
    }



        public static async startConsumers() {
            const {connection , channel} : {connection : Connection, channel : Channel} | any = await this.createAmqpConnection()
            uberLogger.info(`TCP Connection is Established Between the Consumers : ${connection}`)
            await initQueueConsumer(channel as Channel)
        }
}

export default MainQueueManager