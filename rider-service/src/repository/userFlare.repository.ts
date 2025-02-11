import UserFlare from '../database/models/userFlare.models'


class UserFlareRepository {

    async saveUserFlares(payload:any){
        const savedResult = await UserFlare.create({
            userId : payload.userId,
            flareMessage : payload.message,
            userFlareName : payload.userName,
            userFlarePrice : payload.userFlareMoney,
            userDestination : payload.userDestination,
            userCurrentLocation : payload.userCurrentLocation
        })
        return savedResult
    }

    async getAll(){
        const response = await UserFlare.find({})
        return response
    }
}


export default UserFlareRepository