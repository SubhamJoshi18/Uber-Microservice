import mongoose from "mongoose"
import RiderOffer from '../database/models/riderOffers.models'


class UserFlareRepository{
    async getAllUserFlares(userId : mongoose.Schema.Types.ObjectId | string){
        const allFlaresForUser = await RiderOffer.find({
            userId : userId
        })
        return allFlaresForUser
    }
}


export default UserFlareRepository