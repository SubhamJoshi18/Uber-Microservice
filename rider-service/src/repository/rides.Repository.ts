import Rides from '../database/models/rides.models'


class RidesRepository {

    public async getRidesById(ridesId : any){
        const ridesDoc = await Rides.findOne({
            _id : ridesId
        })
        return ridesDoc
    }

    public async updateRidesById(ridesId:any , offerId : any){
        const updatedResult = await Rides.updateOne({
            _id : ridesId
        },{
            $set :{
                offers : [offerId]
            }
        })
        return updatedResult
    }


}

export default RidesRepository