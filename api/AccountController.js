const async = require('async');
const accountService = require("../service/AccountService");




//================================================================
const clearAccount = (result) => {
    accountService.clearAccount(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err })
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, data: fResp.data })
            result.res.status(200).end();
        }
    })

}

//=================================================================
const getAccount = (result) => {
    accountService.getAccount(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: err, msg: "Connection Error getAccount" });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, data: fResp.data });
            result.res.status(200).end();
        }
    });
}

//=================================================================
const updateAccount = (result) => {
    accountService.updateAccount(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err, msg: "Connection Error updateAccount" });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, data: fResp.data });
            result.res.status(200).end();
        }
    })
}

//================================================================================
const getAccountDocs = (result) => {
    accountService.getAccountDocs(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, result: fResp.data });
            result.res.status(200).end();
        }
    })
}

//================================================================================
const getAccountNotifications = (result) => {
    accountService.getAccountNotifications(result, (fResp) => {
        if (fResp.err !== undefined) {
            result.res.json({ success: false, error: fResp.err });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, data: fResp.data });
            result.res.status(200).end();
        }
    })
}

//================================================================================
const getActionRulesByUsers = (result) => {
    accountService.getActionRulesByUsers(result , (fResp) => {
        if(fResp.err !== undefined){
            result.res.json({success: false, error: fResp.err});
            result.res.status(404).end();
        } else {
            result.res.json({success: true, result: fResp.data});
            result.res.status(200).end();
        }
    })
}




module.exports = {
    clearAccount,
    getAccount,
    updateAccount,
    getAccountDocs,
    getAccountNotifications,
    getActionRulesByUsers
}