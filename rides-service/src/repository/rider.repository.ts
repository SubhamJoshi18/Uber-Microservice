import Rider from '../database/models/riders.models'


class RiderRepository{

    public async getRiderName(riderId : any){
        const allRiderResult = await Rider.findOne({
            _id : riderId
        })
        return allRiderResult?.riderName
    }
}


export default RiderRepository