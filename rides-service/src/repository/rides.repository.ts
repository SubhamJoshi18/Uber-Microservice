import Rides from '../database/models/rides.models'

class RidesRepository {

    public async savedResult (validData : any) {
        const insertResult =  await Rides.create({
            ...validData
        })
        return insertResult
    }

}



export default RidesRepository