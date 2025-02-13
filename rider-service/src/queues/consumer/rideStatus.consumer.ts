import { Channel, ConsumeMessage } from 'amqplib';
import { uberLogger } from '../../libs/common.logger'
import { IQueueConfig } from '../types';
import { ridesStatusConfig } from '../../config/queue.config'
import RiderOfferRepository from '../../repository/riderOffer.repository'

const riderOfferRepo = new RiderOfferRepository()



const handleRidesStatusConsumer = async (msg: ConsumeMessage | null) => {
    if (!msg) {
        console.warn('Received null message');
        return;
    }

    try {
        const content = msg.content.toString();
        console.log('Received message:', content);
        const parseContent = JSON.parse(content)
        const {offerId , body } = parseContent
        
        const updatedResult = await riderOfferRepo.acceptOffer(offerId,body)
        
        const validUpdated = updatedResult.acknowledged && updatedResult.matchedCount > 0

        if(validUpdated){
            uberLogger.info(`The Rider has been Updated with the Status Accepted`)
        }

        uberLogger.info(`The Rides Has been Started`)

    } catch (error) {
        console.error('Error processing message:', error);
    }
};


export const riderStatusConsumer = async (channel: Channel, queueName: string) => {
    const {queueExchange} : IQueueConfig | any =  ridesStatusConfig
    try {

        await channel.assertExchange(queueExchange,'direct',{durable:true})

        await channel.assertQueue(queueName,{durable:true})


        uberLogger.info(`Waiting for Message in the ${queueName} Consumer`)
        channel.consume(queueName, (msg) => {
            handleRidesStatusConsumer(msg);
            if (msg) channel.ack(msg);

        });
    } catch (err) {
        console.error('Error in consumer:', err);
    }
};
