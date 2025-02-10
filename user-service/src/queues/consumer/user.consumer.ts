import { Channel, ConsumeMessage } from 'amqplib';
import { userConfig } from '../../config/queue.config';
import { uberLogger } from '../../libs/common.logger';
import { AMQPConnectionExcepitions } from '../../exceptions/index';
import RiderRepository from '../../repository/user.repository'

const riderInstance = new RiderRepository()

export const userQueueConsumer = async (channel: Channel) => {
    const isValidQueueConfig = Object.keys(userConfig).length > 0;


const processCallback = async (msg: ConsumeMessage | null) => {
    if (!msg) {
        uberLogger.warn('Received null message, ignoring...');
        return;
    }

    uberLogger.info(`User Consumer has Started !!`)

    try {
        const content = msg.content.toString();
        uberLogger.info(`Received message from queue: ${content}`);
        const parsedData = JSON.parse(content);
        const {user_id , rider_id, rider_name} = parsedData

        uberLogger.info(`${rider_name} is being updated for the ${user_id}`)
        await riderInstance.updateUserRiderId(user_id,rider_id)
        uberLogger.info(`The User has been Updated Successfully as the Rider`)
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

        const { queueName, queueExchange, queueRoutingKey } = userConfig;

        await channel.assertExchange(queueExchange, 'direct', { durable: true });


        await channel.assertQueue(queueName, { durable: true });

        await channel.bindQueue(queueName, queueExchange, queueRoutingKey);


        await channel.consume(queueName, processCallback, { noAck: false });

        uberLogger.info(`Queue Consumer is listening on queue: ${queueName}`);

    } catch (err) {
        uberLogger.error(`Error while consuming the queue: ${err.message}`);
    }
};
