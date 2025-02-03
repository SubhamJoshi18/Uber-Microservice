import User from '../database/models/user.models'
import { userMongoId } from '../controller/types'

class UserRepository {

    public async findUserById(userId : userMongoId ){
        const existsDoc = await User.findOne({
            _id : userId
        })
        return existsDoc
    }   

}

export default UserRepository