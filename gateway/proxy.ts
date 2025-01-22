import express from 'express'
import proxyServer, { ProxyOptions } from 'express-http-proxy'
import { microServicesConfig } from './config/config'
import { getEnvValue } from './utils/getEnv'
import { uberLogger } from './libs/common.logger'

const proxyApp = express()
const port = getEnvValue('PROXY_PORT') ?? 3000
 
proxyServer('/auth',microServicesConfig['auth'] as ProxyOptions)
proxyServer('/user',microServicesConfig['user'] as ProxyOptions)
proxyServer('/rides',microServicesConfig['rides'] as ProxyOptions)
proxyServer('/rider',microServicesConfig['rider'] as ProxyOptions)


proxyApp.listen(typeof port === 'number' ? Number(port) : port,() => {
    try{
        uberLogger.info(`Uber Microservice has been Started on http://localhost:${port}`)
    }catch(err){
        uberLogger.error(`Error while starting the Proxy Server For Uber Microservice Backend`,err)
        return // exit the callback function after the error is handled
    }
})