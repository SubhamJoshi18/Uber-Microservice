import Token from "../database/models/token.models"


class TokenRepository {


    async findToken(token:string) {
        const existsDocument = Token.findOne({
            token : token
        })
        return existsDocument
    }

    async createToken(token:string,forwardedDate:string){
        const savedDocuments = Token.create({
            token : token,
            expiresIn : forwardedDate
        })
        return savedDocuments
    }
}

export default TokenRepository