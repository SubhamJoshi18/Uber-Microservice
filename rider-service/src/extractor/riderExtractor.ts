


export const extractRiderPayload = (riderPayload :  object | any) : object => {
    if(Object.entries(riderPayload).length > 0) {
            const payloadToSended = {}
            const formatedArray = [riderPayload]
            const filteredSender = formatedArray.map((item :any) => {
                const newPayload = {
                    rider_id : item._id,
                    rider_name : item.riderName,
                }
                return newPayload
            }).pop()

            return Object.assign(payloadToSended,filteredSender)
    }
    return {}
}

export const extractUserData = (userPayload : object | any) => {
    const extractPayload = {
        userId : userPayload._id,
        userPhoneNumber :userPayload.phoneNumber,
        userName : userPayload.username,
    }
    return extractPayload
}


export const extractRiderData = (riderPayload : object | any) => {
    const extractPayload = {
        userFlareMoney : riderPayload.ride_money,
        userCurrentLocation : riderPayload.ride_current_location,
        userDestination : riderPayload.ride_destination_location
    }
    return extractPayload
}