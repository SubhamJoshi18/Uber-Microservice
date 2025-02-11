import { DatabaseExceptions } from '../exceptions/index'
import UserFlareRepository from '../repository/userFlare.repository'


class RiderFlareService {

    private userFlareRepository : UserFlareRepository

    constructor(){
        this.userFlareRepository = new UserFlareRepository()
    }


    public async getAllFlares(){
        const responses = await this.userFlareRepository.getAll()
        if(Array.isArray(responses) && responses.length === 0){
            throw new DatabaseExceptions(`There is not any Flare Currently Available Right now`)
        }
        return responses
    }

}   


export default new RiderFlareService()