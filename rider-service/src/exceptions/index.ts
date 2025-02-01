import statusCodes from 'http-status-codes'


class AMQPConnectionExcepitions extends Error {
    public statusCode: number
    public status : string = 'NOT Found'

    constructor(message :string,statusCode :number) {
        super(message)
        this.name = 'AMQP Connection Error'
        this.statusCode = statusCode
        this.status = statusCode.toString().startsWith('4') ? 'NOT Found' : 'Connected'
        Object.setPrototypeOf(this,new.target.prototype)
    }

    getStatusCode() : number {
        return this.statusCode
    }
    
    getStatus() : string {
        return this.status
    }
}

class HttpExceptions extends Error {
    
    public statusCode : number
    public status : string = 'IDLE'

    constructor(message : string, statusCode:number){
            super(message)
            this.name = 'HttpExceptions'
            this.statusCode = statusCode
            this.status = statusCode.toString().startsWith('4') ? 'Exception' : 'Success'
            Object.setPrototypeOf(this,new.target.prototype)
    }

    getStatusCode() : number {
        return this.statusCode
    }

    getStatusMessage() : string {
        return this.message
    }
}



class DatabaseExceptions extends HttpExceptions {
    constructor(message : string, statusCode=statusCodes.CONFLICT){
        super(message,statusCode)
        this.name = 'DatabaseExceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }
}



class ValidationExceptions extends HttpExceptions {
    constructor(message : string, statusCode=statusCodes.BAD_REQUEST){
        super(message,statusCode)
        this.name = 'ValidationExceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }
}

class BadExceptions extends HttpExceptions {
    constructor(message : string, statusCode=statusCodes.BAD_GATEWAY){
        super(message,statusCode)
        this.name = 'BadExceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }
}

class JsonWebTokenExceptions extends HttpExceptions {
    constructor(message : string, statusCode=statusCodes.FORBIDDEN){
        super(message,statusCode)
        this.name = 'JsonWebTokenExceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }
}

export {
    BadExceptions,
    DatabaseExceptions,
    ValidationExceptions,
    HttpExceptions,
    JsonWebTokenExceptions,
    AMQPConnectionExcepitions
}