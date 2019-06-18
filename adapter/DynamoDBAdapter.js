const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const moment = require('moment');

AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { s3: '2006-03-01' };

const fResponse = require("../common/fResponse");
const docClient = new AWS.DynamoDB.DocumentClient();


//================================================================
const getAllDoc = (result, fnCallback) => {
    var docParamObj = result.req.body;
    var respArr = [];

    var paramsOfDoc = {
        TableName: "GOLGI_DOC"
    };

    docClient.scan(paramsOfDoc, function(err, data) {
        if (err) return err;
        else {
            var docsArrOfResp = data.Items;
            docsArrOfResp.forEach(docItem => {
                var metaData = docItem.metadata;
                if (metaData.BELGE_TURU_GRUBU === docParamObj.docType) respArr.push(docItem);
            });
            fnCallback(data.Items);
        }
    });
}


//=================================================================
const deleteDynamoDBItem = (itemID) => {
    var params = {
        TableName: "GOLGI_DOC",
        Key: {
            "itemID": itemID
        },
        ConditionExpression: "itemID = :itemID",
        ExpressionAttributeValues: {
            ":itemID": itemID
        }
    };

    docClient.delete(params, function(err, data) {
        if (err) console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        else console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    });
}

const getActionTemplateByDocType = (docType, fnCallback) => {
    var fResponse = new FunctionResponse("getActionTemplateByDocType", [docType, fnCallback]);

    var params = {
        TableName: "GOLGI_ACTION_CONFIG",
        KeyConditionExpression: "#docType = :docType",
        ExpressionAttributeNames: {
            "#docType": "docType"
        },
        ExpressionAttributeValues: {
            ":docType": docType
        }
    }

    docClient.query(params, function(err, data) {
        if (err) fResponse.setErr(err);
        else fResponse.setData(data.Items[0].actionTemplate)
        fnCallback(fResponse);
    });
}

//================================================================
const getAllActionLog = (result, fnCallback) => {
    var fResponse = new FunctionResponse("getAllActionLog", [result, fnCallback]);


    var paramsOfDoc = {
        TableName: "GOLGI_ACTION_LOG"
    };

    docClient.scan(paramsOfDoc, function(err, data) {
        if (err) fResponse.setErr(err)
        else fResponse.setData(data)
        fnCallback(fResponse);
    });
}

//================================================================
const getEngineStatus = (result, fnCallback) => {
    var fResponse = new FunctionResponse("getEngineStatus", [result, fnCallback]);


    var paramsOfDoc = {
        TableName: "GOLGI_STATS"
    };

    docClient.scan(paramsOfDoc, function(err, data) {
        if (err) fResponse.setErr(err)
        else fResponse.setData(data)
        fnCallback(fResponse);
    });
}




module.exports = {
    deleteDynamoDBItem,
    getAllDoc,
    getActionTemplateByDocType,
    getAllActionLog,
    getEngineStatus
}