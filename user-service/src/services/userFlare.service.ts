import mongoose from "mongoose";
import UserFlareRepository from '../repository/userFlare.repository'
import { DatabaseExceptions } from '../exceptions/index'


class UserFlareService {


    private userFlareRepository : UserFlareRepository

    constructor(){
        this.userFlareRepository = new UserFlareRepository()
    }

    public async getAllFlares(userId : mongoose.Schema.Types.ObjectId | string){
        const allFlare = await this.userFlareRepository.getAllUserFlares(userId)
        if(!allFlare || allFlare.length === 0){
            throw new DatabaseExceptions(`There is no offer flare for you`)
        }
        return allFlare
    }
}


export default new UserFlareService()