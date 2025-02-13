import mongoose from "mongoose";
import { formattedMongooseMessage } from '../../utils/transformData'

const offerRiderSchema = new mongoose.Schema({

    riderName : {
        type : String,
        required : [true,formattedMongooseMessage('Rider Name')],
    },

    riderNewPrice : {
        type : Number,
        required : [true ,formattedMongooseMessage('Rider Price')]
    },

    riderMessage : {
        type : String,
        required :[true,formattedMongooseMessage('Rider Message')]
    },


    riderOffer : {
        type : String,
        default :'NOT-ACCEPTED'
    },

    rideStart : {
        type : Boolean,
        default : false
    },
    riderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rider'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    ridesId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'RiderOffer'
    }
},
{
    timestamps : true
})

const RiderOffer = mongoose.model('RiderOffer',offerRiderSchema)
export default RiderOffer