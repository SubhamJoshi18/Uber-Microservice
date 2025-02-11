import { Channel, ConsumeMessage } from 'amqplib';
import { uberLogger } from '../../libs/common.logger'
import { IQueueConfig } from '../types';
import { riderFlareConfig } from '../../config/queue.config';

const handleRiderFlareConsumer = (msg: ConsumeMessage | null) => {
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


export const riderFlareConsumer = async (channel: Channel, queueName: string) => {
    const {queueExchange} : IQueueConfig | any =  riderFlareConfig
    try {

        await channel.assertExchange(queueExchange,'direct',{durable:true})

        await channel.assertQueue(queueName,{durable:true})


        uberLogger.info(`Waiting for Message in the ${queueName} Consumer`)
        channel.consume(queueName, (msg) => {
            handleRiderFlareConsumer(msg);
            if (msg) channel.ack(msg);

        });
    } catch (err) {
        console.error('Error in consumer:', err);
    }
};
