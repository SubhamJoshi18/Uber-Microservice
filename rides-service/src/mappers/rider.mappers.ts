
import { checkObjectSize } from '../utils/transformData'
import { uberLogger } from '../libs/common.logger'
import { ValidationExceptions } from '../exceptions/index'


export const mapRiderAndUser = (userObject : object, riderObject : object) => {
    const invalidObjects = !(checkObjectSize(userObject)) || !(checkObjectSize(riderObject))
    
    if(invalidObjects) {
        uberLogger.error(`Error in validating the Objects, The Size Does not match For the Rider and User Objects`)
        throw new ValidationExceptions(`Object Size Does not Matches`)
    }
    return Object.assign(formatedUserObject(userObject), formattedRiderObject(riderObject))
}



const formatedUserObject = (userObj : object) => {
    const userDoc = {
    }
    for (let [key,value] of Object.entries(userObj)) {
        if(key === '_id') {
            key = 'user_id'
        }
        if(!(key in userDoc)) {
            userDoc[key] = value  
        }
    }
    return userDoc
}


const formattedRiderObject = (riderObj : object) => {
     const riderDoc = {}
    for(let [key,value] of Object.entries(riderObj)) {
         if(key === '_id') {
            key = 'rider_id'
         }

         if(!(key in riderDoc)) {
            riderDoc[key] = value
         }
    }
    return riderDoc
}
