const dynamoDBAdapter = require(__dirname + "/../adapter/DynamoDBAdapter");
const fResponse = require("../common/fResponse");

//================================================================
const getEngineStatus = (result, fnCallback) => {
    var fResp = new FunctionResponse("getEngineStatus", [result, fnCallback]);
    
    dynamoDBAdapter.getEngineStatus(result, fResp => {
        if (fResp.err !== undefined) fResp.setErr(fResp.err)
        else fResp.setData(fResp.data);
        fnCallback(fResp);
    })
}

//================================================================
module.exports = {
    getEngineStatus
}