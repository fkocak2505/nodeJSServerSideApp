const uuidv1 = require('uuid/v1');
const type = require("./Types");
const fResponse = require("../common/fResponse");

const dynamoDBAdapter = require("../adapter/DynamoDBAdapter");

const getActionTemplateByDocType = (docType, fnCallback) => {
    var fResp = new FunctionResponse("getActionTemplateByDocType", [docType, fnCallback]);

    dynamoDBAdapter.getActionTemplateByDocType(docType, fResp => {
        if (fResp.err !== undefined) fResp.setErr(fResp.err)
        else fResp.setData(fResp.data);
        fnCallback(fResp);
    })
}


module.exports = {
    getActionTemplateByDocType
}