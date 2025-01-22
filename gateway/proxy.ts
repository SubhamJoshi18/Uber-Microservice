import express from 'express'
import proxyServer from 'express-http-proxy'
import { microServicesConfig } from './config/config'


proxyServer('/auth',microServicesConfig['auth'] as any) 