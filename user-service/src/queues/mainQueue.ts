import {Connection,Channel} from 'amqplib'
import { uberLogger } from '../libs/common.logger'
import amqplib from 'amqplib'
import { getEnvValue } from '../utils/getEnv'
import { userQueueEnabled } from '../constants/queues'
import { userQueueConsumer } from './consumer/user.consumer'
import { offerFlareConsumer } from './consumer/offer.consumer'


export const initQueueConsumer =  async() => {
    let connection : Connection
    let channel : Channel
    const url = getEnvValue('AMQP_URL')
    try{
        connection = await amqplib.connect(url as string)
        channel = await connection.createChannel()
        await manageQueueServices(channel as Channel)
    }catch(err){
        uberLogger.error(`Error while Initating The Queue Consumer`)
        return
    }
}




const manageQueueServices = async (channel : Channel) => {
    const isEnabled = typeof userQueueEnabled === 'boolean' && userQueueEnabled
    if(isEnabled){
        await userQueueConsumer(channel as Channel)
        await offerFlareConsumer(channel as Channel)
    }
}