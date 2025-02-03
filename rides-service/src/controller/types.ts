import mongoose from "mongoose"

type userMongoId  = string | mongoose.Schema.Types.ObjectId
interface ICreateRider {
    currentLocation : string
    geometry: {
        lat : number,
        lng : number
    },
    destination : string
    price : number
}

export {
    userMongoId,
    ICreateRider
}