import { Channel, ConsumeMessage } from 'amqplib';
import { uberLogger } from '../../libs/common.logger'
import { riderConfig } from '../../config/queue.config'
import { IQueueConfig } from '../types';

/**
 * Handles the incoming message.
 * @param msg The RabbitMQ message
 */
const handleRiderMessage = (msg: ConsumeMessage | null) => {
    if (!msg) {
        console.warn('Received null message');
        return;
    }

    try {
        const content = msg.content.toString();
        console.log('Received message:', content);


    } catch (error) {
        console.error('Error processing message:', error);
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


        uberLogger.info(`Waiting for Message in the Rider Consumer`)
        channel.consume(queueName, (msg) => {
            handleRiderMessage(msg);
            if (msg) channel.ack(msg);

        });
    } catch (err) {
        console.error('Error in consumer:', err);
    }
};
