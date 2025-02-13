import mongoose from "mongoose"
import { formattedMongooseMessage } from "../../utils/transformData"

const riderModel = new mongoose.Schema({

    riderName : {
        type : String,
        required : [true,formattedMongooseMessage('RiderName')]
    },

    riderLike : {
        type : String,
        required : [true,formattedMongooseMessage('Rider Like')],
        default : 0
    },

    isActiveRider : {
        type : Boolean,
        default : true
    },
    
    riderComment : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'RiderComment',
        }
    ],

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :[true,formattedMongooseMessage('User')]
    },

    totalEarn : {
        type : Number,
        default : 0 
    },

    riderHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],


    riderReport : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'RiderReport'
    }]

}) 


const Rider = mongoose.model('Rider',riderModel)
export default Rider