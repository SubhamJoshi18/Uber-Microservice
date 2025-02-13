import {Channel} from 'amqplib'

interface IAMQPConfig {
    channel  : Channel
}

interface IQueueConfig {
    queueName : string
    queueExchange : string
    queueRoutingKey : string
}
export  {
    IAMQPConfig,
    IQueueConfig
}