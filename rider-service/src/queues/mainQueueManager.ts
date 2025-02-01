import  amqplib , {Connection,Channel} from 'amqplib'
import { AMQPConnectionExcepitions } from '../exceptions/index'
import { uberLogger } from '../libs/common.logger'
import { getEnvValue } from '../utils/getEnv'
import {IQueueConfig } from './types'
import { createGenericChannel } from './createGenericChannel'


class MainQueueManager {

    public connection : Connection
    public channel : Channel

    constructor() {
        this.createAmqpConnection()
    }
    
    private async createAmqpConnection () {
        let retryCount = 0
        let retryStatus= true
        const url = getEnvValue('AMQP_URL')
        while(retryCount < 4 && typeof retryStatus === 'boolean' && retryStatus) {
            try{
                this.connection = await amqplib.connect(url as string)
                this.channel = await this.connection.createChannel()
            }catch(err){
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

      public async publishMessage (content : object, queueConfig : IQueueConfig) {
        const isvalidObject=  typeof content === 'object' && Object.entries(content).length > 0
            const isvalidConfig = Object.entries(queueConfig).length > 0
            
            if (!isvalidConfig || !isvalidObject) {
                throw new AMQPConnectionExcepitions(`Payload Content or Queue Config Does not match`,404)
            }
            this.channel = await createGenericChannel({channel : this.channel},queueConfig)
            const strinifyJsonContent = Buffer.from(JSON.stringify(content))

                try{    
            
                    this.channel.publish(
                            queueConfig['queueExchange'],
                            queueConfig['queueRoutingKey'],
                            strinifyJsonContent
                    )

                    uberLogger.info(`Message sended Successfully to the ${queueConfig['queueName']}`)
                }catch(err){
                    uberLogger.error(`Error while publishing Channel${err.message}`)
                }
                finally{
                    this.channel.ack(strinifyJsonContent as any)
                }
        }
}

export default MainQueueManager