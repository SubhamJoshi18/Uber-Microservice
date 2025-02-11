import { ValidationExceptions } from '../../exceptions/index'

export const validateBody = (schemaBody : object , schemaStructure : any) : object => {
    try{
        const {error , value } = schemaStructure.validate(schemaBody)
        
        if(error) {
            throw new ValidationExceptions(`The Requested Body is invalid or not operational Details : ${error.details}, Please Try again`)
        }
        return Object.values(value).length > 0 ? value : {}
    }catch(err){
        console.log(err)
        throw err
    }
}