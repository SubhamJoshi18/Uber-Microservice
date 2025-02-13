import { Channel, ConsumeMessage } from 'amqplib';
import { offerFlareConfig } from '../../config/queue.config'
import { uberLogger } from '../../libs/common.logger';
import { AMQPConnectionExcepitions } from '../../exceptions/index';


export const offerFlareConsumer = async (channel: Channel) => {
    const isValidQueueConfig = Object.keys(offerFlareConfig).length > 0;


    const processCallback = async (msg: ConsumeMessage | null) => {
        if (!msg) {
            uberLogger.warn('Received null message, ignoring...');
            return;
        }

    uberLogger.info(`User Consumer has Started !!`)

    try {
        const content = msg.content.toString();
        uberLogger.info(`Received message from queue: ${content}`);
        // const parsedData = JSON.parse(content);

        // console.log(parsedData)
    } catch (error) {
        uberLogger.error(`Error processing message: ${error.message}`);
        channel.nack(msg, false, true);
    }finally {
        channel.ack(msg);
        uberLogger.info(`Message acknowledged successfully.`);
    }
};


    try {
        if (!isValidQueueConfig) {
            throw new AMQPConnectionExcepitions(`Queue Configuration Does not Meet the Requirements`, 404);
        }

        const { queueName, queueExchange, queueRoutingKey } = offerFlareConfig;

        await channel.assertExchange(queueExchange, 'direct', { durable: true });


        await channel.assertQueue(queueName, { durable: true });

        await channel.bindQueue(queueName, queueExchange, queueRoutingKey);


        await channel.consume(queueName, processCallback, { noAck: false });

        uberLogger.info(`Queue Consumer is listening on queue: ${queueName}`);

    } catch (err) {
        uberLogger.error(`Error while consuming the queue: ${err.message}`);
    }
};
