import express from 'express'
import { Application } from 'express'
import { MainAuthMiddleware } from './middlewares/server.middleware'
import { MainAuthRouter } from './routes/server.routes'


class MainAuthApp {
    public expressApp : Application


    constructor() {
        this.expressApp = express()
        MainAuthMiddleware(this.expressApp)
        MainAuthRouter(this.expressApp)
    }

    getAuthServer = () : Application => {
        return this.expressApp
    }

}

export default MainAuthApp

