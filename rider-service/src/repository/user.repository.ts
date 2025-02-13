import mongoose from 'mongoose'
import User from '../database/models/user.models'


class UserRepository {  

    public async getUser (userId : string) {
        const existsDocument = await User.findOne({
            _id : userId
        })
        return existsDocument
    }

    public async removeUserRider(userId : string) {
         const removeResult = await User.updateOne({
            _id : userId
         }, {
            rider : null as unknown as mongoose.Schema.Types.ObjectId
         }, {
            $new : true
         })
         return removeResult
    }
}



export default UserRepository