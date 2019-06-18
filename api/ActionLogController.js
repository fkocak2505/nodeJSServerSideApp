const accountService = require("../service/ActionLogService");


//================================================================
const getAllActionLog = (result) => {
    accountService.getAllActionLog(result, fResp => {
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
    getAllActionLog
}