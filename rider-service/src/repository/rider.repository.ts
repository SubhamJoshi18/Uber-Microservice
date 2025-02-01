import Rider from '../database/models/riders.models'


class RiderRepository {
    
    async findRiderName (riderName : string) {
        const existsDocument = await Rider.findOne({
            riderName : riderName
        })
        return existsDocument
    }

}

export default RiderRepository