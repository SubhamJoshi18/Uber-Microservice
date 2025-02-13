import Rides from '../database/models/rides.models'

class RidesRepository {

    public async savedResult (validData : any) {
        const insertResult =  await Rides.create({
            ...validData
        })
        return insertResult
    }

    public async getAllRidesOffer(ridesId : any){
        const allOffers = await Rides.findOne({
            _id : ridesId
        })
        return allOffers?.offers
    }

    public async getRidesById(ridesId:any){
        const ridesDocument = await Rides.findOne({
            _id : ridesId
        })
        return ridesDocument
    }


    public async clearOffer(ridesId:any){
        const clearResult = await Rides.updateOne({
            _id : ridesId
        },
        {
            $set : {
                offers : []
            }
        })
        return clearResult
    }

    public async updateResult(ridesId:any, data:any){
        return await Rides.updateOne({
            _id : ridesId
        }, {
            ...data
        })
    }
}



export default RidesRepository