

const createConfig = (...configData : Array<string>)  : {} => {
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
    return queueConfig
    }
    
    return configData
}

const userConfig = createConfig('user-queue','user-exchange','user-rk')
const riderConfig = createConfig('rider-queue','rider-exchange','rider-rk')
const ridesStatusConfig = createConfig('ride-status-queue','ride-status-exchange','ride-status-rk')
const riderFlareConfig = createConfig('rider-flare-queue','rider-flare-exchange','rider-flare-rk')

export {
    userConfig,
    riderConfig,
    ridesStatusConfig,
    riderFlareConfig
}