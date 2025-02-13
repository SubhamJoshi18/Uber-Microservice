import {Channel} from 'amqplib'
import { uberLogger } from '../../libs/common.logger'
import { IQueueConfig } from '../types'
import { AMQPConnectionExcepitions } from '../../exceptions/index'





export const publishRiderToUser  = async (channel : Channel,queueConfig : IQueueConfig,content:any) : Promise<void|boolean> => {
    let validPublish = true
    try{    
        const validChannelPromise = await Promise.allSettled([assertExchange(channel,queueConfig['queueExchange']) , assertQueue(channel,queueConfig['queueName'])])

        if(validChannelPromise.filter((data:any) => data.status !== 'fulfilled').length > 0) {
            throw new AMQPConnectionExcepitions(`All the Queue Config Does not Matches`,404)
        }

        await channel.prefetch(1)

        const stringifyBody = Buffer.from(JSON.stringify(content))

        channel.publish(queueConfig['queueExchange'],queueConfig['queueRoutingKey'],stringifyBody)

        uberLogger.info(`The Message has been Sended to the User Queue Successfully`)
    }catch(err){
        uberLogger.error(`Error publishing the Flare to the User`)
        validPublish = false
        return validPublish
    }
}



const assertExchange = async (channel : Channel, exchangeName : string) => {
    return await channel.assertExchange(exchangeName,'direct', {durable:true})
}

const assertQueue = async (channel:Channel,queueName : string) => {
    return await channel.assertQueue(queueName,{durable:true})
}