import { uberLogger } from '../../libs/common.logger'
import { IQueueConfig } from "../types"
import {Channel} from 'amqplib'
import { assertExchangeToQueue,assertQueueOrCheck } from '../channelUtils'



export const publishMessageToRiderStatus = async (data: any,  channel : Channel , {queueExchange,queueName,queueRoutingKey} : IQueueConfig) => {
        try{    
            await Promise.all([assertExchangeToQueue(channel,queueExchange) , assertQueueOrCheck(channel,queueName)])
            await channel.bindQueue(queueName,queueExchange,queueRoutingKey)
            await channel.prefetch(1)
            const bufferData = Buffer.from(JSON.stringify(data))
            channel.publish(queueExchange,queueRoutingKey,bufferData)
            uberLogger.info(`The Message is published to the Rider Microservices Data: ${JSON.stringify(data)}`)
        }catch(err){
            uberLogger.error(`Error publishing the message to the Rider Microservices, Error Reason : ${err.message}`)
        }finally {
            if(channel){
                channel.close()
            }
        }
}





