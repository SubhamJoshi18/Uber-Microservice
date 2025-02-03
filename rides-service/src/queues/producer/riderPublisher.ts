import { uberLogger } from '../../libs/common.logger'
import { IQueueConfig } from "../types"
import {Channel} from 'amqplib'
import { assertExchangeToQueue,assertQueueOrCheck } from '../channelUtils'


export const prepareRiderData = (validPayload : any | object) => {
        const payload = {
            message : `The User has Requested Ride From ${validPayload.user.currentLocation} to the ${validPayload.user.destination} with the fare : ${validPayload.rider_properties.ride_money}`,
            userDetails : validPayload.user,
            riderDetails : validPayload.rider_properties
        }
        return payload
}

export const publishMessageToRider = async (data: any,  channel : Channel , {queueExchange,queueName,queueRoutingKey} : IQueueConfig) => {
        try{    
            await Promise.all([assertExchangeToQueue(channel,queueExchange) , assertQueueOrCheck(channel,queueName)])
            await channel.bindQueue(queueName,queueExchange,queueRoutingKey)
            await channel.prefetch(1)
            const preparedData  = prepareRiderData(data)
            const bufferData = Buffer.from(JSON.stringify(preparedData))
            channel.publish(queueExchange,queueRoutingKey,bufferData)
            uberLogger.info(`The Message is published to the Rider Microservices Data: ${JSON.stringify(preparedData)}`)
        }catch(err){
            uberLogger.error(`Error publishing the message to the Rider Microservices, Error Reason : ${err.message}`)
        }finally {
            if(channel){
                channel.close()
            }
        }
}





