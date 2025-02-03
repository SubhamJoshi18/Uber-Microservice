import mongoose from "mongoose"
import { formattedMongooseMessage } from "../../utils/transformData"

const riderComment = new mongoose.Schema({
    comment : {
        type : String,
        required: [true,formattedMongooseMessage('Comment')]
    },

    ratings : {
        type : Number,
        default : 0.0
    },

    rider  :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rider',
        required : [true,formattedMongooseMessage(`Rider`)]
    }
}, {
    timestamps : true
})


const RiderComment = mongoose.model('RiderComment',riderComment)
export default RiderComment