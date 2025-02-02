import User from '../database/models/user.models'


class UserRepository {  

    public async getUser (userId : string) {
        const existsDocument = await User.findOne({
            _id : userId
        })
        return existsDocument
    }
}



export default UserRepository