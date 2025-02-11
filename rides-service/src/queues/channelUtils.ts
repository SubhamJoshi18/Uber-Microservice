import {Channel} from 'amqplib'



const assertExchangeToQueue = async (channel : Channel,queueExchange: string) => {
  await channel.assertExchange(queueExchange,'direct',{durable:true})
}

const assertQueueOrCheck = async (channel : Channel,queueName : string) => {
    await channel.assertQueue(queueName,{durable:true})
}

export {
    assertExchangeToQueue,
    assertQueueOrCheck
}