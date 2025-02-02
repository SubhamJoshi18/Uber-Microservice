import mongoose from 'mongoose'
import { IRiderBody } from '../controller/types'
import Rider from '../database/models/riders.models'


class RiderRepository {

    async findRiderName (riderName : string) {
        const existsDocument = await Rider.findOne({
            riderName : riderName
        })
        return existsDocument
    }


    async saveResult (userId : mongoose.Schema.Types.ObjectId , riderPayload:IRiderBody){
        const savedResult = await Rider.create({
            ...riderPayload
        })
        savedResult.user = userId as any
        await savedResult.save()
        return savedResult
    }


    async findRiderUserId (userId : any) {

        const existsDocument = await Rider.findOne({
            user : userId
        })
        return existsDocument
    }

    async getFilter (filterArray : Array<any>){
        const filterResult = await Rider.find({
            $and : filterArray
        })
        return filterResult
    }


    async findAllRider() {
        const allRider = await Rider.find({})
        return allRider
    }
}

export default RiderRepository