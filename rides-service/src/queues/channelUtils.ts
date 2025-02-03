import {Channel} from 'amqplib'



const assertExchangeToQueue = async (channel : Channel,queueExchange: string,isDur=false) => {
    return isDur ? await channel.assertExchange(queueExchange,'direct',{durable : isDur}) : await channel.assertExchange(queueExchange,'direct')
}

const assertQueueOrCheck = async (channel : Channel,queueName : string,isDur=false) => {
    return  isDur ? await channel.assertQueue(queueName,{durable:isDur}) : await channel.assertQueue(queueName,{durable:isDur})
}

export {
    assertExchangeToQueue,
    assertQueueOrCheck
}