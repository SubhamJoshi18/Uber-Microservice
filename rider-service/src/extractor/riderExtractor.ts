


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