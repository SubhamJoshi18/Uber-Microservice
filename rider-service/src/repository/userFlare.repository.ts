import mongoose from 'mongoose'
import UserFlare from '../database/models/userFlare.models'


class UserFlareRepository {

    async saveUserFlares(payload:any){
        const savedResult = await UserFlare.create({
            userId : payload.userId,
            flareMessage : payload.message,
            userFlareName : payload.userName,
            userFlarePrice : payload.userFlareMoney,
            userDestination : payload.userDestination,
            userCurrentLocation : payload.userCurrentLocation
        })
        return savedResult
    }

    async getAll(){
        const response = await UserFlare.find({})
        return response
    }


    async getFlareByUser(userId : string | mongoose.Schema.Types.ObjectId){
        const searchResult = await UserFlare.findOne({
            userId : userId
        })
        return searchResult
    }
}


export default UserFlareRepository