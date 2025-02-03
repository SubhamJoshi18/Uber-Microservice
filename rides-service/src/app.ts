import express from 'express'
import { Application } from 'express'
import { MainRiderMiddleware } from './middlewares/server.middleware'
import { MainRiderRouter } from './routes/server.routes'

class MainRidesApp {
    public expressApp : Application

    constructor() {
        this.expressApp = express()
        MainRiderMiddleware(this.expressApp)
        MainRiderRouter(this.expressApp)
    }

    getRidesServer = () : Application => {
        return this.expressApp
    }

}

export default MainRidesApp

