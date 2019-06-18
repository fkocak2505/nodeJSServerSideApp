const AWS = require('aws-sdk');
const moment = require("moment");
const async = require('async');
const uuidv1 = require('uuid/v1');
AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { s3: '2006-03-01' };
const docClient = new AWS.DynamoDB.DocumentClient();

const fResponse = require("../common/fResponse");
const enumJS = require("../common/enum");
const s3Adapter = require(__dirname + "/../adapter/S3Adapter");
const dynamoDBAdapter = require(__dirname + "/../adapter/DynamoDBAdapter");
const sqsAdapter = require(__dirname + "/../adapter/SQSAdapter");


//================================================================
const register = (result, insertedItem, fnCallback) => {
    var fResp = new FunctionResponse("register", [result, fnCallback]);

    var registerParamObj = result.req.body;

    var splitEmailArr = registerParamObj.eposta.split("@");
    var fkEmail = splitEmailArr[0] + "@finanskutusu.com"

    var kayitTarihi = moment().format('YYYY/MM/DD-HH:mm:ss');
    var paramsOfRegister = {
        TableName: "GOLGI_ACCOUNT",
        Item: {
            "accountID": insertedItem.activeAccountRealID,
            "actions": {},
            "checkOpDate": moment().format('YYYY/MM/DD-HH:mm:ss'),
            "email": fkEmail,
            "favorites": JSON.stringify(ViewMenuObj),
            "permission": {}
        }
    };

    docClient.put(paramsOfRegister, function(err, data) {
        if (err) {
            fResp.setErr(err);
        } else {
            fResp.setData(data);
        }
        fnCallback(fResp);
    });
}

//================================================================
const getAccount = (result, fnCallback) => {
    var fResp = new FunctionResponse("getAccount", [result, fnCallback]);

    var reqParams = result.req.body;

    var dynamoParams = {
        TableName: "GOLGI_ACCOUNT",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": reqParams.email
        }
    };

    docClient.scan(dynamoParams, function(err, data) {
        if (err) fResp.setErr(err);
        else fResp.setData(data.Items);
        fnCallback(fResp);
    });
}

//================================================================
const updateAccount = (result, fnCallback) => {
    var fResp = new FunctionResponse("updateAccount", [result, fnCallback]);

    var reqParams = result.req.body;
    var dynamoParams = {
        TableName: "GOLGI_ACCOUNT",
        Key: {
            "accountID": reqParams.accountID
        },
        ReturnValues: "ALL_NEW"
    };

    fillParamObj(dynamoParams, reqParams);
    docClient.update(dynamoParams, function(err, data) {
        if (err) fResp.setErr(err);
        else fResp.setData(data);
        fnCallback(fResp);
    });
}

//=================================================================
const fillParamObj = (paramsOfReq, paramObj) => {
    var UpdateExpression = "set ";
    var ExpressionAttributeValues = {};
    for (var key in paramObj) {
        if (key !== "accountID") {
            if (key === "checkOpDate") paramObj[key] = moment().format("YYYY/MM/DD-HH:mm:ss");
            UpdateExpression += key + " = :" + key;
            ExpressionAttributeValues[":" + key] = paramObj[key];
        }
    }

    paramsOfReq.UpdateExpression = UpdateExpression;
    paramsOfReq.ExpressionAttributeValues = ExpressionAttributeValues;
}

//=================================================================
const getAccountDocs = (result, fnCallback) => {
    var fResp = new FunctionResponse("getAccountDocs", [result, fnCallback]);

    var docParamObj = result.req.body;
    var respArr = [];

    var paramsOfDoc = {
        TableName: "GOLGI_DOC",
        FilterExpression: "accountID = :accountID",
        ExpressionAttributeValues: {
            ":accountID": docParamObj.accountID
        }
    };

    docClient.scan(paramsOfDoc, function(err, data) {
        if (err) fResp.setErr(err);
        else {
            var docsArrOfResp = data.Items;
            docsArrOfResp.forEach(docItem => {
                var metaData = docItem.metadata;
                if (metaData.BELGE_TURU_GRUBU === docParamObj.docType) respArr.push(docItem);
            });
            fResp.setData(respArr);
        }
        fnCallback(fResp);
    });
}

//================================================================
const getAccountNotifications = (result, fnCallback) => {
    var fResp = new FunctionResponse("getAccountNotifications", [result, fnCallback]);

    var checkDateObj = result.req.body;
    var nowDate = moment(moment().format("YYYY/MM/DD-HH:mm:ss"));

    var params = {
        TableName: "GOLGI_DOC",
        FilterExpression: "accountID = :accountID and opDate > :opDate",
        ExpressionAttributeValues: {
            ":accountID": checkDateObj.accountID,
            ":opDate": checkDateObj.opDate
        }
    };

    docClient.scan(params, function(err, data) {
        if (err) fResp.setErr(err);
        else {
            var data = data.Items;
            data.forEach(items => {
                var opDate = moment(items.opDate);
                if (nowDate.diff(opDate, "minutes") === 0) items.diffDate = 1
                else items.diffDate = nowDate.diff(opDate, "minutes");
            });
            fResp.setData(data);
        }
        fnCallback(fResp);
    });

}

//================================================================
const clearAccount = (result, fnCallback) => {
    var fResp = new FunctionResponse("clearAccount", [result, fnCallback]);

    var userNameValObj = result.req.body;
    var respArr = [];

    async.waterfall(
        [
            function(callback) {
                let inUploadFolder = "inputs/accounts/" + userNameValObj.userName + "/uploads";
                let outUploadFolder = "outputs/accounts/" + userNameValObj.userName + "/uploads";

                s3Adapter.listBucketObjKeys("golgibucket", "", (resp) => {
                    resp.data.forEach(item => {
                        if (item.includes(inUploadFolder) && item.replace(inUploadFolder, "").length > 0) s3Adapter.deleteBucketItem("golgibucket", item, fResp => {});
                        if (item.includes(outUploadFolder) && item.replace(outUploadFolder, "").length > 0) s3Adapter.deleteBucketItem("golgibucket", item, fResp => {});
                    });
                    respArr.push("Uploads Item deleted\n");
                    callback(null, "Uploads Item deleted...");
                });
            },
            function(msg, callback) {
                dynamoDBAdapter.getAllDoc(result, (resp) => {
                    resp.forEach(item => {
                        if (item.itemID !== undefined && item.accountID.includes(userNameValObj.userName)) {
                            dynamoDBAdapter.deleteDynamoDBItem(item.itemID);
                        }
                    });
                    respArr.push("DynamoDB Items deleted\n");
                    callback(null, "DynamoDB Items deleted...");
                })
            },
            function(msg, callback) {
                let queueURL = 'https://sqs.eu-west-1.amazonaws.com/931836528038/GolgiSQS';
                sqsAdapter.purgeQueue(queueURL, (resp) => {
                    respArr.push("SQS Queue Messages deleted\n");
                    // result.res.json({ success: true, data: respArr });
                    // result.res.status(200).end();
                    fResp.setData(respArr);
                    fnCallback(fResp);
                    callback(null, "SQS Queue Messages deleted...");
                });
            }
        ],
        function(err) {
            console.log(err);
        }
    )
}

//================================================================
const getActionRulesByUsers = (result, fnCallback) => {
    logger.info("getActionRulesByUsers Servisi " + JSON.stringify(result.req.body) + " parametresi ile çağırıldı");

    var fResp = new FunctionResponse("getActionRulesByUsers", [result, fnCallback]);
    var objOfAccountID = result.req.body;

    var params = {
        TableName: "GOLGI_ACCOUNT",
        FilterExpression: "accountID = :accountID",
        ExpressionAttributeValues: {
            ":accountID": objOfAccountID.accountID
        }
    };

    docClient.scan(params, function(err, data) {
        if (err) fResp.setErr(err);
        else {

            if (data.Items.length > 1) fResp.setErr(objOfAccountID.accountID + " is multiple");
            else {
                var objOfAction = data.Items[0].actions;
                fResp.setData(objOfAction);
            }
        }
        fnCallback(fResp);
    });
}


//================================================================
module.exports = {
    register,
    getAccount,
    updateAccount,
    getAccountDocs,
    getAccountNotifications,
    clearAccount,
    getActionRulesByUsers
};