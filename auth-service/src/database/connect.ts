import mongoose from "mongoose";
import { uberLogger } from '../libs/common.logger'

class SingeltonMongoConnection {

    public baseUrl : string

    constructor(baseUrl : string)  {
        this.baseUrl = baseUrl
    }

    public getSingeltonConnecition = async () => {
        let retryCount = 0
        let retryStatus = true
        let mongoConnection : any

        while (retryCount < 5 && retryStatus ) {
            try{    
                mongoConnection  = await mongoose.connect(this.baseUrl)
                if(mongoConnection){
                    break
                }
            }catch(err) {
                uberLogger.error(`Error Connecting to the MongoDb, Increasing the Retry Count on ${retryCount}`)
                retryCount += 1
                continue
            }
        }
        return mongoConnection
    }
}

export default SingeltonMongoConnection