import RiderOffer from '../database/models/riderOffer.models'


class RiderOfferRepository {

    async publishRiderOfferToDb(payload: object | any,newFlare:number,ridesId : any){
        const savedResult = await RiderOffer.create({
            riderName : payload.riderName,
            riderNewPrice : newFlare,
            riderMessage : payload.message,
            riderId : payload.riderId,
            userId : payload.userId,
            ridesId : ridesId
        })
        return savedResult
    }

    public async acceptOffer(offerId:any,data:any){
        const updatedReuslt = await RiderOffer.updateOne({
            _id : offerId
        }, 
    {
        $set : {
            ...data
        }
    })
    return updatedReuslt
    }
}


export default RiderOfferRepository