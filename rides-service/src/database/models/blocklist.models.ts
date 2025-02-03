import mongoose from "mongoose";
import { formattedMongooseMessage } from "../../utils/transformData"

const blockListSchema = new mongoose.Schema({

    accessToken : {
        type :String,
        required : [true,formattedMongooseMessage('Access token')]
    },

    isBlockList : {
        type : Boolean,
        requried : [true,formattedMongooseMessage('isBlockList')],
        default : false
    }
}, {
    timestamps : true
})

const BlockList = mongoose.model('BlockList',blockListSchema)
export default BlockList