import { IRiderBody } from '../controller/types'
import RiderRepository from '../repository/rider.repository'
import { DatabaseExceptions } from '../exceptions/index'
class RiderService  {

    private riderRepository : RiderRepository

    constructor(){
        this.riderRepository = new RiderRepository()
    }

    public async createRider(parseBody:IRiderBody) {
        const { riderName } = parseBody 

        const isRiderExistPromise  = await Promise.allSettled([
            this.riderRepository.findRiderName(riderName as string)
        ])

        const filterRejected =isRiderExistPromise.filter((data : any) => data.status !== 'fulfilled')

        if(Array.isArray(filterRejected) && filterRejected.length > 0) {
            throw new DatabaseExceptions(`There is some issue while Creating the Rider`)
        }

        
    }
}


export default RiderService