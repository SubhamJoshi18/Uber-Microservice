import express from 'express'
import { Application } from 'express'
import morgan from 'morgan'


export const MainAuthMiddleware = (expressApp : Application) => {
            expressApp.use(express.json())
            expressApp.use(express.urlencoded({extended:true}))
            expressApp.use(morgan('dev'))
}