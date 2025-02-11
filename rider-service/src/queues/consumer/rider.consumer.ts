import { Channel, ConsumeMessage } from 'amqplib';
import { uberLogger } from '../../libs/common.logger'
import { riderConfig } from '../../config/queue.config'
import { IQueueConfig } from '../types';
import { extractRiderData, extractUserData } from '../../extractor/riderExtractor'
import UserFlareRepository from '../../repository/userFlare.repository'

const userFlareRepo = new UserFlareRepository()
/**
 * Handles the incoming message.
 * @param msg The RabbitMQ message
 */
const handleRiderMessage = async  (msg: ConsumeMessage | null) => {
    if (!msg) {
        console.warn('Received null message');
        return;
    }

    try {
        const content = msg.content.toString();
        const parseContent = JSON.parse(content)
        if(!parseContent){
            throw new Error(`Error while converting the buffer string to the javascript objec`)
        }
        const parsemessage = parseContent.message
        const parseUserDoc = parseContent.userDetails
        const parseRiderDetails = parseContent.riderDetails
        const concatObject = Object.assign(extractUserData(parseUserDoc),extractRiderData(parseRiderDetails))
        const finalPayload = Object.assign(concatObject,{message : parsemessage})
        await userFlareRepo.saveUserFlares(finalPayload)
        uberLogger.info(`Flare Saved For all the Riders`)
    } catch (error) {
        uberLogger.error(`Error while handling the process callback function`,error.message)
    }
};

/**
 * Consumes messages from the RabbitMQ queue.
 * @param channel The AMQP channel
 */
export const riderConsumer = async (channel: Channel, queueName: string) => {
    const {queueExchange} : IQueueConfig | any =  riderConfig
    try {

        await channel.assertExchange(queueExchange,'direct',{durable:true})

        await channel.assertQueue(queueName,{durable:true})


        uberLogger.info(`Waiting for Message in the ${queueName} Consumer`)
        channel.consume(queueName, (msg) => {
            handleRiderMessage(msg);
            if (msg) channel.ack(msg);

        });
    } catch (err) {
        console.error('Error in consumer:', err);
    }
};
