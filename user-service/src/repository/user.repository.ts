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

    async findEmail(email : string) {
        const existsEmail = await User.findOne({
            email : email
        })
        return existsEmail
    }

    async UploadPhoto(userId : string | mongoose.Schema.Types.ObjectId, photoUrl : string) {
        const savedResult = await userProfileModel.updateOne({
            user : userId
        },{
            image : photoUrl
        },
    {
        $new : true
    })
    return savedResult
    }

    async deletePhoto(userId : string) {
        const deleteResult = await userProfileModel.updateOne({
          user : userId
        },{
            image : ''
        })
        return deleteResult
    }

    async findUserProfileid(profileId : string) {
        const existsDoc = await userProfileModel.findOne({
            _id : profileId as string
        })
        return existsDoc
    }



    async updateProfile (userId:string | mongoose.Schema.Types.ObjectId,validObject : object)  : Promise<mongoose.UpdateWriteOpResult>{
        const updatedResult = await userProfileModel.updateOne({
            user : userId
        }, {
            ...validObject
        },{
            $new : true
        })
        return updatedResult
    }


    async updateUserRiderId(userId: any , riderId : any) : Promise<any> {
        const updatedResult = await User.updateOne({
            _id : userId
            },{
               rider : riderId
        },
        {
            $new : true
        })
    return updatedResult
    }

}

export default UserProfileRepository