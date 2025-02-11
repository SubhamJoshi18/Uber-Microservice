import mongoose from "mongoose";
import { formattedMongooseMessage } from '../../utils/transformData'

const userFlareModel = new mongoose.Schema({
    
    userFlareName : {
        type : String,
        required: [true,formattedMongooseMessage(`User Flare Name`)]
    },

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    flareMessage : {
        type : String,
        required:[true,formattedMongooseMessage('Message')]
    },
    userFlarePrice : {
        type : Number,
        required:[true,formattedMongooseMessage('User Flare Price')]
    },

    isActiveRide : {
        type : Boolean,
        default:false
    },

    userDestination : {
        type : String,
        required:[true,formattedMongooseMessage('User Destination')]
    },

    userCurrentLocation : {
        type : String,
        required : [true,formattedMongooseMessage('User Current Location')]
    }


})

const UserFlare = mongoose.model('UserFlare',userFlareModel)
export default UserFlare