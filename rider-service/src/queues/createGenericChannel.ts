
import {Channel, Replies} from 'amqplib'
import { uberLogger } from '../libs/common.logger'
import { AMQPConnectionExcepitions } from '../exceptions/index'
import { IAMQPConfig,IQueueConfig } from './types'

export const createGenericChannel = async  (amqpConfig : IAMQPConfig, queueConfig : IQueueConfig) => {

    try{
        const {channel} = amqpConfig

        channel.on('connection', () => {
             uberLogger.info(`The Channel is connected with the ${queueConfig['queueName']}`)
        })

        const isValidQueueConfig = await Promise.allSettled([
            checkExchangeIfExists(queueConfig['queueExchange'],channel),
            checkQueueIfExists(queueConfig['queueName'],channel)
        ])

        const filterdRejected = isValidQueueConfig.filter((data : any) => data.status !== 'fulfilled')

        const isValidConfig = Array.isArray(filterdRejected) && filterdRejected.length > 0

        if(isValidConfig){
            throw new AMQPConnectionExcepitions(`Config Does not meet Requirements`,404)
        }

        await channel.assertExchange(queueConfig['queueExchange'],'direct',{durable:true})

        await channel.assertQueue(queueConfig['queueName'],{durable : true})

        await channel.bindQueue(queueConfig['queueName'],queueConfig['queueExchange'],queueConfig['queueRoutingKey'])

        await channel.prefetch(1)

        return channel
    }catch(err){
        throw err
    }
}


const checkQueueIfExists = async  (queueName : string, channel : Channel) => {
    const isQueueExists : Replies.AssertQueue = await channel.checkQueue(queueName)
    if(!isQueueExists){
        throw new AMQPConnectionExcepitions(`Queue Does not Exists`,404)
    }
    return isQueueExists
}


const checkExchangeIfExists = async (queueExchange : string, channel : Channel) => {
    const isExchangeExists  : Replies.AssertExchange | any = await channel.checkExchange(queueExchange) 
    if(!isExchangeExists){
        throw new AMQPConnectionExcepitions(`Exchange Does not Exists`,404)
    }
    return isExchangeExists
}