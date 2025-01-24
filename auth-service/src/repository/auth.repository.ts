import { IRegisterBody } from "../interfaces/auth.interface"
import User from "../database/models/user.models"

class AuthRepository {

    async findOneEmail(value : string){
        const existsDocument = await User.findOne({
            email : value
        })
        return existsDocument
    }

    async findOneUsername(value : string){
        const existsDocument = await User.findOne({
            username : value
        })
        return existsDocument
    }


    async savedRegisterData(data : IRegisterBody ) {
        const savedResult = await User.create({
            ...data
        })
        return savedResult
    }
 
}

export default AuthRepository