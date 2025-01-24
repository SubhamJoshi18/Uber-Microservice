import { loginSchemaBody } from '../../validations/auth.validation'
import { ValidationExceptions } from '../../exceptions/index'

export const validateBody = (schemaBody : object , schemaStructure : any) : object => {
    try{
        const {error , value } = schemaStructure.validate(schemaBody)
        
        if(typeof error !== undefined || null) {
            throw new ValidationExceptions(`The Requested Body is invalid or not operational, Please Try again`)
        }
        return Object.values(value).length > 0 ? value : {}
    }catch(err){
        throw err
    }
}