import mongoose from "mongoose"
import User from "../database/models/user.models"
import userProfileModel from "../database/models/userProfile.models"



class UserProfileRepository {

    async findUserId (userId  : string) {
        const existsDoc = await User.findOne({
            _id : userId as string
        })
        return existsDoc
    }

    async findUserProfileid(profileId : string) {
        const existsDoc = await userProfileModel.findOne({
            _id : profileId as string
        })
        return existsDoc
    }


    async updateProfile (userId:string | mongoose.Schema.Types.ObjectId,validObject : object) {
        const isObjectEmpty = Object.entries(validObject).length === 0
        if(isObjectEmpty){
            return {
                message : `Nothing to be Updated`
            }
        }
        const updatedResult = await userProfileModel.updateOne({
            user : userId
        }, {
            ...validObject
        },{
            $new : true
        })
        return updatedResult
    }

}

export default UserProfileRepository