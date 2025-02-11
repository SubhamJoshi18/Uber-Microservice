import {Channel} from 'amqplib'
import { uberLogger } from '../libs/common.logger'
import { riderConsumer } from './consumer/rider.consumer'
import { riderConfig } from '../config/queue.config'
import { riderFlareConfig } from '../config/queue.config'
import { riderFlareConsumer } from './consumer/riderFlare.consumer'


async function initQueueConsumer(channel:Channel) {
        try{   
            await riderConsumer(channel as Channel,riderConfig['queueName'])
            await riderFlareConsumer(channel as Channel,riderFlareConfig['queueName'])
        }catch(err){
            uberLogger.error(`Error Starting the Queue Consumer`)
        }

}



export default initQueueConsumer