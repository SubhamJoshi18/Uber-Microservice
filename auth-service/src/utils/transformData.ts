

export const convertNumber = <T>(value : T) : number => {
    if(typeof value === 'number'){
        return value
    }else{
        return Number(value)
    }
}


export const isNullorUndefined = ( value : any) => {
    return value === null || undefined
}

export const isTrue = (value : boolean) => {
    return typeof value === 'boolean' && value
}


export const formattedMongooseMessage = (value : string) => {
    return `The mongose Attribute ${value} is Required , but it is currently missing`
}