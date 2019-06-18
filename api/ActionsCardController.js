const actionsCardService = require("../service/ActionsCardService");


//================================================================
const getActionsCard = (result) => {
    actionsCardService.getActionsCard(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json(fResp.data);
            result.res.status(200).end();
        }
    })
}

//================================================================
module.exports = {
    getActionsCard
}