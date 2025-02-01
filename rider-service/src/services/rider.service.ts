import { IRiderBody } from '../controller/types'
import RiderRepository from '../repository/rider.repository'
import { DatabaseExceptions } from '../exceptions/index'
import MainQueueManager from '../queues/mainQueueManager'
import { userConfig } from '../config/queue.config'
import { uberLogger } from '../libs/common.logger'
import { IQueueConfig } from '../queues/types'


class RiderService  {

    private riderRepository : RiderRepository
    private amqpServices : MainQueueManager

    constructor(){
        this.riderRepository = new RiderRepository()
        this.amqpServices = new MainQueueManager()
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

        const isSaved = await this.riderRepository.saveResult({...parseBody})
        try{
            uberLogger.info(`Publishing Payload : ${JSON.stringify(isSaved)} to the ${userConfig['queueName']}`)
            await this.amqpServices.publishMessage(isSaved,userConfig as IQueueConfig)
        }catch(err){
            uberLogger.error(`Error while publishing payload : ${JSON.stringify(isSaved)}`)
            throw err
        }
        return isSaved
    }
}


export default RiderService