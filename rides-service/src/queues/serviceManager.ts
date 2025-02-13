import {Connection,Channel} from 'amqplib'
import { uberLogger } from '../libs/common.logger'
import { handleRidesStatus } from './consumer/ridesStatusConsumer'


export const manageConsumerServices = async (connection : Connection, channel : Channel) => {
    uberLogger.info(`TCP Connection is established between the consumers`,connection)
    const startAllConsumers = async () => {
         await handleRidesStatus(channel as Channel)
    }
    await startAllConsumers()
}   
