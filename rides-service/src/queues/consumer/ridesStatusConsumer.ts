import {ConsumeMessage,Channel} from 'amqplib'
import { uberLogger } from '../../libs/common.logger'
import { ridesStatusConfig } from '../../config/queue.config'
import { IQueueConfig } from '../types'
import { AMQPConnectionExcepitions } from '../../exceptions/index'



const processCallback =  async (msg : ConsumeMessage) => {
    let validHandle = true

    uberLogger.info(`Message has Been Received`,msg)
    return validHandle

}



export const handleRidesStatus = async (channel : Channel) => {
    const  {queueExchange,queueName} : IQueueConfig  | any = ridesStatusConfig
    try{    
        await channel.assertExchange(queueExchange,'direct',{durable:true})
        await channel.assertQueue(queueName,{durable:true})

        uberLogger.info(`Waiting for the Message in the ${queueName} ....`)

        channel.consume(queueName,async (msg : ConsumeMessage | null) => {
            try{
                if(msg && msg.content){
                   const queueResult =  await processCallback(msg)
                   if(typeof queueResult === 'boolean' && !queueResult){
                     throw new AMQPConnectionExcepitions(`Error While Consuming to the Message due to ${JSON.stringify(msg)}`,503)
                   }
                }
            }catch(err){
                throw err
            }finally{
                if(msg) channel.ack(msg)
            }
        },{
            noAck:true
        })
    }catch(err){
        uberLogger.error(`Error handling the the Rides Status, Due to`,err.message)
        return
    }
}