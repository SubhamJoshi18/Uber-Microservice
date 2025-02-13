import mongoose from 'mongoose'
import RiderOffer from '../database/models/riderOffer.models'

class RidesOfferRepository{

    public async getRiderOfferById(offerId : any){
        const riderOfferDoc = await RiderOffer.findOne({
            _id : offerId
        })
        return riderOfferDoc
    }

    public async acceptOffer(offerId:any){
        const updatedReuslt = await RiderOffer.updateOne({
            _id : offerId
        }, 
    {
        $set : {
            riderOffer : 'ACCEPTED'
        }
    })
    return updatedReuslt
    }

    public async getAllUserFlares(userId : mongoose.Schema.Types.ObjectId | string){
        const allFlaresForUser = await RiderOffer.find({
            userId : userId
        })
        return allFlaresForUser
    }
}


export default RidesOfferRepository