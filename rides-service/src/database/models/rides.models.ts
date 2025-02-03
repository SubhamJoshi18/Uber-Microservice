import mongoose from "mongoose"
import { formattedMongooseMessage } from '../../utils/transformData'


const ridesSchema = new mongoose.Schema({



    ride_current_location : {
        type : String,
        required:[true,formattedMongooseMessage('Ride Current Location')]
    },

    ride_destination_location : {
        type : String,
        required : [true,formattedMongooseMessage('Ride Destination Location')]
    },
    ride_started_at : {
        type : Date,
        required : [true,formattedMongooseMessage('Ride Started At')]
    },

    rider_name : {
        type : String,
        required : [true,formattedMongooseMessage('Rider Name')]
    },

    ride_ended_at : {
        type : Date,
        default : new Date(),
    },

    ride_money : {
        type : Number,
        required : [true,formattedMongooseMessage('Ride Money')]
    },


    ride_estimation_time : {
        type : String,
        required : [true,formattedMongooseMessage('Estimation Time')] 
    },


    ride_completed_at : {
        type : String,
        required : [true,formattedMongooseMessage('Ride Completed At')],
        default : '0s'
    },

    ride_rider : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rider',
        required:[true,formattedMongooseMessage('Ride Rider')]
    },

    ride_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true,formattedMongooseMessage('Ride User')]
    }
}, {
    timestamps : true
})

const Rides = mongoose.model('Rides',ridesSchema)
export default Rides