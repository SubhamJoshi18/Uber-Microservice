import RiderOffer from '../database/models/riderOffer.models'


class RiderOfferRepository {

    async publishRiderOfferToDb(payload: object | any,newFlare:number){
        const savedResult = await RiderOffer.create({
            riderName : payload.riderName,
            riderNewPrice : newFlare,
            riderMessage : payload.message,
            riderId : payload.riderId,
            userId : payload.userId
        })
        return savedResult
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
}


export default RiderOfferRepository