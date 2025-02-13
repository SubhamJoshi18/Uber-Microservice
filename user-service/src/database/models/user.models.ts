import mongoose from "mongoose";
import { formattedMongooseMessage } from "../../utils/transformData"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, formattedMongooseMessage('username')]
    },

    email : {
        type : String,
        required: [true,formattedMongooseMessage('email')]
    },

    phoneNumber : {
        type : String,
        required : [true,formattedMongooseMessage('phoneNumber')]
    },

    password  : {
        type : String,
        required : [true,formattedMongooseMessage('password')]
    },

    role : {
        type : String,
        enum : ['user','rider'],
        default : 'user'
    },
    userProfile : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserProfile',
    },
    rider : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rider',
    }
},
{
    timestamps : true
})


const User = mongoose.model('User',userSchema)
export default User