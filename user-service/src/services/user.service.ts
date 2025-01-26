import mongoose from "mongoose";
import UserProfileRepository from '../repository/user.repository'
import { checkItHasProfile, isNullorUndefined } from "../utils/transformData"
import { DatabaseExceptions } from "../exceptions/index"
import { uberLogger } from "../libs/common.logger"
import { userProfileMapper } from "../mappers/user.mappers"



class UserProfileService {


    private userRepository : UserProfileRepository;

    constructor(){
        this.userRepository = new UserProfileRepository()

    }

    public async getUserProfileService (userId : string | mongoose.Schema.Types.ObjectId)  : Promise<any> {
        const isUserExists = await this.userRepository.findUserId(userId as string)

        if(!isUserExists || isNullorUndefined(isUserExists)){
            throw new DatabaseExceptions(`The User Does not Exists, Please Create a new User`)
        }
      
        const isProfileExists = checkItHasProfile(isUserExists) ? isUserExists.userProfile : {}
        
        const userProfile = await this.userRepository.findUserProfileid(isProfileExists as string)
        
        const isProfileEmpty = Object.entries(userProfile as object).length === 0

        if(isProfileEmpty) {
            throw new DatabaseExceptions(`The User Profile Is not Operational, Issue While Updating the Profile , Please  Try again.`)
        }
        uberLogger.info(`The ${isUserExists.username} Contain Profile status : ${typeof isProfileExists === 'object'  &&  Object.entries(isProfileExists as object).length > 0}`)
        const mappedResult = userProfileMapper(isUserExists,userProfile)
        return mappedResult
    }
}

export default new UserProfileService()