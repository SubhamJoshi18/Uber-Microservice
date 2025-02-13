import multer from 'multer'
import {Request} from 'express'


const storage = multer.diskStorage({
    destination : (_req: Request, _file : any, cb : Function) => {
        cb(null,'uploads/')
    },
    filename : (_req:Request,file:any,cb:Function) => {
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

export {storage}