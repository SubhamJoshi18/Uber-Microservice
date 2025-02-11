import mongoose from "mongoose";
import { formattedMongooseMessage } from '../../utils/transformData'

const riderReportSchema = new mongoose.Schema({
    reportComment : {
        type : String,
    },

    rider : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rider',
        required: [true,formattedMongooseMessage('Rider')]
    }

},{
    timestamps : true
})


const RiderReport = mongoose.model('RiderReport',riderReportSchema)
export default RiderReport