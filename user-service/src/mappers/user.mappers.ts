



export const userProfileMapper = (userDocument : any,profileDocument : any) => {
       const userDoc = generateValidObject('user_id',userDocument)
       const userProfileDoc = generateValidObject('user_profile_id',profileDocument)
       const concatObject =  Object.assign(userDoc,userProfileDoc)     
       const keyToRemoved = ['password','_v','user','userProfile','_id','user_profile_id']
       const filteredObject = Object.fromEntries(
        Object.entries(concatObject).filter(([key]) => !keyToRemoved.includes(key))
      );
      
      return filteredObject;

}

const generateValidObject = (prefixId : string, document : any | object) => {
    const nestedDoc = document._doc
    const responseObject = {}
    for (const [key,value] of Object.entries(nestedDoc)) {
        if (key in responseObject) {
            continue
        }
        const isMongoId = typeof key === 'string' && key === '_id'
        if(isMongoId) {responseObject[prefixId] = value}
        responseObject[key] = value
   }
   return responseObject
}