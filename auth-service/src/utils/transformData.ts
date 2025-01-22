

export const convertNumber = <T>(value : T) : number => {
    if(typeof value === 'number'){
        return value
    }else{
        return Number(value)
    }
}