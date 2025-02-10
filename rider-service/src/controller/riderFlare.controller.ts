import {Request,Response,NextFunction} from 'express'


class RiderFlareController {

    public async createFlareToRider(req:Request,res:Response,next:NextFunction){
        try{            

        }catch(err){
            next(err)
        }


    }



}

export default new RiderFlareController()