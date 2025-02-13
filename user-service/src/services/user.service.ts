import mongoose from "mongoose";
import UserProfileRepository from '../repository/user.repository'
import { checkItHasProfile, deepCopyObject, isNullorUndefined, renameSecondaryEmail } from "../utils/transformData"
import { DatabaseExceptions, ValidationExceptions } from "../exceptions/index"
import { uberLogger } from "../libs/common.logger"
import { userProfileMapper } from "../mappers/user.mappers"
import { IUpdateUserProfile, IUploadPhoto } from '../controller/types'
import FileHelper from "../helpers/file.helper"
import { MIMETYPE } from "../constants/modules"
import path from 'path'

class UserProfileService {


    private userRepository : UserProfileRepository;
    private fileHelper : FileHelper

    constructor(){
        this.userRepository = new UserProfileRepository()
        this.fileHelper = new FileHelper()

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

    public async updateUserProfile (userId : string | mongoose.Schema.Types.ObjectId, parseBody : Partial<IUpdateUserProfile>) : Promise<any> {
        const isUserExists = await this.userRepository.findUserId(userId as string)

        if(isNullorUndefined(isUserExists)){
            throw new DatabaseExceptions(`The User you are trying to Update Does not exists on the System, System Error`)
        }

        const isProfileExists = checkItHasProfile(isUserExists) ? isUserExists?.userProfile : {}

        const userProfile = await this.userRepository.findUserProfileid(isProfileExists as string)

        uberLogger.info(`The User has a valid profile , The User Profile Status : ${typeof userProfile === 'object'  && Object.entries(userProfile as object).length > 0}`)

        const { secondaryEmail } = parseBody

        const isMatchWithPrimary = await this.userRepository.findEmail(secondaryEmail as string)

        if( secondaryEmail &&  (!(isNullorUndefined(isMatchWithPrimary)) || isMatchWithPrimary)){
            throw new DatabaseExceptions(`The Secondary Email Matches with the Primary Email`)
        }

        const parsePayload = renameSecondaryEmail(parseBody)

        const preparePayload = deepCopyObject({...parsePayload})

        const isObjectEmpty = Object.entries(preparePayload).length === 0


        if(isObjectEmpty){
            return {
                message : `Nothing to be Updated`
            }
        }

        const updatedResult : mongoose.UpdateWriteOpResult = await this.userRepository.updateProfile(userId, preparePayload as Partial<IUpdateUserProfile>)

        const validUpdated = updatedResult.acknowledged && updatedResult.matchedCount > 0 && updatedResult.modifiedCount > 0

        return validUpdated ? updatedResult : {
            message : {
                updatedStatus : updatedResult.acknowledged,
                modifiedCount : updatedResult.modifiedCount,
                data :'Issue while updating the Credential, Please Try again...'
            }
        }
    }

    public async uploadPhoto(userId : string | mongoose.Schema.Types.ObjectId, parseBody : Required<IUploadPhoto>){
        
        const existsDocument = await this.userRepository.findUserId(userId as string)

        if(isNullorUndefined(existsDocument)) {
            throw new DatabaseExceptions(`The Document Does not exists on the system, Please Try again..`)
        }       
        const createS3Path = this.fileHelper.getS3BucketPrefix()
        
        const bucketMade = this.fileHelper.checkIfPathExists(createS3Path)

        if(!bucketMade['pathStatus']) this.fileHelper.createS3BucketFolder(createS3Path as string);


        const {mimetype,size, originalname,path} = parseBody

        const splitMimeType = mimetype.split('/').filter((item:any) => MIMETYPE.includes(item)).pop()
        
        const validSize = size.toString().startsWith('0')


        if(!MIMETYPE.includes(splitMimeType?.toLowerCase() as string) || validSize) {
            throw new ValidationExceptions(`The Provided Photo Format Does not Support in our System , Please Try a appropriate Format`)
        }

        const originalPath = this.fileHelper.createPath(path as string)
        const copyPath = this.fileHelper.createPath('S3Bucket' as string)
        const copiedStatus = this.fileHelper.copyUploadToS3Bucket(originalPath,copyPath)
        const uploadStatus = await this.userRepository.UploadPhoto(userId,originalname)

        const validUpdated = uploadStatus.acknowledged && uploadStatus.matchedCount > 0 && uploadStatus.modifiedCount > 0

        return copiedStatus && validUpdated ? uploadStatus : {
            message : {
                updatedStatus : uploadStatus.acknowledged,
                modifiedCount : uploadStatus.modifiedCount,
                data :'Issue while updating the Credential, Please Try again...'
            }
     }
   
    }


    public async deletePhoto(userId : string | mongoose.Schema.Types.ObjectId){
        const userProfileExists = await this.userRepository.findUserId(userId as string)

        if(isNullorUndefined(userProfileExists)){
            throw new DatabaseExceptions(`The Document Does not exists on the system, Please Try again..`)
        }

        const isValidUserProfile = checkItHasProfile(userProfileExists) ? userProfileExists?.userProfile  : null
        const userProfile : any = await this.userRepository.findUserProfileid(isValidUserProfile as any)
        const isImageExists = userProfile?.image !== null
        if(!isImageExists){
            throw new DatabaseExceptions(`The User Does not Have any Photo Uploaded , Cannot delete it unknown`)
        }

       
        const s3BucketPath = this.fileHelper.getS3BucketPrefix()
        const listPhotos = this.fileHelper.listFolder(s3BucketPath)
        const [imagePrefix , imageMimetype] = userProfile?.image.split('.')

        const validPhoto = listPhotos.filter((item : string) => item.includes(imagePrefix as string) && item.endsWith(`.${imageMimetype}`)).pop()

        const s3BucketPrefix = path.join(s3BucketPath,validPhoto as string)
        
        this.fileHelper.deleteS3BucketPrefix(s3BucketPrefix)

        const deleteResult = await this.userRepository.deletePhoto(userId as string)

        const validDeleted = deleteResult.acknowledged && deleteResult.matchedCount > 0 && deleteResult.modifiedCount > 0

        return  validDeleted ? deleteResult : {
            message : {
                updatedStatus : deleteResult.acknowledged,
                modifiedCount : deleteResult.modifiedCount,
                data :'Issue while updating the Credential, Please Try again...'
            }
     }


    }


}

export default new UserProfileService()