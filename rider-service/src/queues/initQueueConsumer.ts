import {Channel} from 'amqplib'
import { uberLogger } from '../libs/common.logger'
import { riderConsumer } from './consumer/rider.consumer'
import { riderConfig, ridesStatusConfig } from '../config/queue.config'
import { riderFlareConfig } from '../config/queue.config'
import { riderFlareConsumer } from './consumer/riderFlare.consumer'
import { riderStatusConsumer } from './consumer/rideStatus.consumer'


async function initQueueConsumer(channel:Channel) {
        try{   
            await riderConsumer(channel as Channel,riderConfig['queueName'])
            await riderFlareConsumer(channel as Channel,riderFlareConfig['queueName'])
            await riderStatusConsumer(channel as Channel,ridesStatusConfig['queueName'])

        }catch(err){
            uberLogger.error(`Error Starting the Queue Consumer`)
        }

}



export default initQueueConsumer