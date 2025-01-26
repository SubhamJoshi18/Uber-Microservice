import express from 'express'
import { Application } from 'express'
import { MainUserMiddleware } from './middlewares/server.middleware'
import { MainUserRouter } from './routes/server.routes'


class MainUserApp {
    public expressApp : Application

    constructor() {
        this.expressApp = express()
        MainUserMiddleware(this.expressApp)
        MainUserRouter(this.expressApp)
    }

    getAuthServer = () : Application => {
        return this.expressApp
    }

}

export default MainUserApp

