import  amqplib , {Connection,Channel} from 'amqplib'
import { AMQPConnectionExcepitions } from '../exceptions/index'
import { uberLogger } from '../libs/common.logger'
import { getEnvValue } from '../utils/getEnv'
import { manageConsumerServices } from './serviceManager'
// import {IQueueConfig } from './types'
// import { createGenericChannel } from './createGenericChannel'


class MainQueueManager {

  
    
    private async createAmqpConnection ()  : Promise<any> {

        let  connection : Connection
        let  channel : Channel

        let retryCount = 0
        let retryStatus= true
        const url = getEnvValue('AMQP_URL')
        while(retryCount < 4 && typeof retryStatus === 'boolean' && retryStatus) {
            try{
                connection = await amqplib.connect(url as string)
                channel = await connection.createChannel()
                return {
                    connection,
                    channel
                }
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


    public async initQueueConsumers(){
       const {connection , channel} : {connection : Connection, channel : Channel} | any  =   await this.createAmqpConnection()
        try{
            await manageConsumerServices(connection,channel)
        }catch(err){
            throw err
        }
    }

    public async getChannel(){
        const {channel} : {connection ?: Connection, channel : Channel} | any  =   await this.createAmqpConnection()
        return channel
    }

}

export default new MainQueueManager()