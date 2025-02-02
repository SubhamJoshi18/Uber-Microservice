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
    async deleteRider(riderId : string | mongoose.Schema.Types.ObjectId) {
        const removeRiderResult = await Rider.deleteOne({
            _id : riderId
        })
        return removeRiderResult
    }

    async findRiderById(riderId : any) {
        const riderDocuments = await Rider.findOne({
            _id : riderId
        })
        return riderDocuments
    }


    async pushRiderReportedIdToRider (riderId : string , reportedId : any) : Promise<any> {
        const  riderUpdatedResult = await Rider.updateOne({
            _id : riderId
        }, { 
            $addToSet : {riderReport : reportedId}
        })
        return riderUpdatedResult
    }

    async clearRiderHistory (riderId : string) {
        const updatedResult = await Rider.updateOne({
            _id : riderId
        }, {
            riderHistory : []
        }, {
            $new : true
        })
        return updatedResult
    }

    async updateRider(riderId : string, parseContent : {riderName : string}) {
        const updatedResult = await Rider.updateOne({
            _id : riderId
                }, {
                    ...parseContent
                },
            {
                $new : true
            })
    return updatedResult
    }

}

export default RiderRepository