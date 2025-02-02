import RiderReport from "../database/models/riderReport.models"



class RiderReportRepository {

    public async publishReport(riderId : string, reportComment : string) {
        const savedResult = await RiderReport.create({
            reportComment : reportComment,
            rider : riderId,

        })
        return savedResult
    }

}


export default RiderReportRepository