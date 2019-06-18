const dynamoDBAdapter = require(__dirname + "/../adapter/DynamoDBAdapter");
const fResponse = require("../common/fResponse");

//================================================================
const getAllActionLog = (result, fnCallback) => {
    var fResp = new FunctionResponse("getAllActionLog", [result, fnCallback]);
    
    dynamoDBAdapter.getAllActionLog(result, fResp => {
        if (fResp.err !== undefined) fResp.setErr(fResp.err)
        else fResp.setData(fResp.data);
        fnCallback(fResp);
    })
}

//================================================================
module.exports = {
    getAllActionLog
}