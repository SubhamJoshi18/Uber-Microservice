import Rider from '../database/models/riders.models'


class RiderRepository{

    public async getRiderName(riderId : any){
        const allRiderResult = await Rider.findOne({
            _id : riderId
        })
        return allRiderResult?.riderName
    }

    public async appendUserToHistory(userId : any, riderId : any) {
        const updatedResult = await Rider.updateOne({
            _id : riderId
        },{
            $set: {
                riderHistory : [userId]
            }
        })
        return updatedResult
    }
}


export default RiderRepository