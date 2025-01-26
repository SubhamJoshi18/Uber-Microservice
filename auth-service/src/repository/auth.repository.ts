import { IRegisterBody } from "../interfaces/auth.interface"
import User from "../database/models/user.models"
import userProfileModel from "../database/models/userProfile.models"

class AuthRepository {

    async findOneEmail(value : string){
        const existsDocument = await User.findOne({
            email : value
        })
        return existsDocument
    }

    async findOneId(value : any) {
        const existsDocument = await User.findOne({
            _id : value
        })
        return existsDocument
    }

    async findOneUsername(value : string){
        const existsDocument = await User.findOne({
            username : value
        })
        return existsDocument
    }

    async findOnePhoneNumber(value:string){
        const existsDocument = await User.findOne({
            phoneNumber : value
        })
        return existsDocument
    }


    async savedRegisterData(data : IRegisterBody ) {
        const savedResult = await User.create({
            ...data
        })

        const newProfile = await userProfileModel.create({
            user : savedResult._id
        })

        savedResult.userProfile = newProfile._id
        await savedResult.save()

        return savedResult
    }

    async saveData(data:any | object){
        return await User.create({...data})
    }
 
}

export default AuthRepository