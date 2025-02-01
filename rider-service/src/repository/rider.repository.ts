import { IRiderBody } from '../controller/types'
import Rider from '../database/models/riders.models'


class RiderRepository {

    async findRiderName (riderName : string) {
        const existsDocument = await Rider.findOne({
            riderName : riderName
        })
        return existsDocument
    }


    async saveResult (riderPayload:IRiderBody){
        const savedResult = await Rider.create({
            ...riderPayload
        })
        return savedResult
    }
}

export default RiderRepository