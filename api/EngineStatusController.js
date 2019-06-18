const engienStatusService = require("../service/EngineStatusService");


//================================================================
const getEngineStatus = (result) => {
    engienStatusService.getEngineStatus(result, fResp => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err })
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, data: fResp.data })
            result.res.status(200).end();
        }
    })
}

//================================================================
module.exports = {
    getEngineStatus
}