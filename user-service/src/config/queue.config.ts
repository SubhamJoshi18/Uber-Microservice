

const createConfig = (...configData : Array<string>)  : {
    queueName: string,
    queueExchange: string,
    queueRoutingKey : string
}  => {
    const queueConfig = {
        queueName : '',
        queueExchange: '',
        queueRoutingKey : ''
    }
    const isValidArray = Array.isArray(configData) && configData.length > 0

    if(isValidArray){
        const [queueName,queueExchange,queueRoutingKey] = configData
        queueConfig['queueName'] = queueName
        queueConfig['queueExchange'] = queueExchange
        queueConfig['queueRoutingKey'] = queueRoutingKey
    }
    return queueConfig
    
}

const userConfig = createConfig('user-queue','user-exchange','user-rk')

export {
    userConfig
}