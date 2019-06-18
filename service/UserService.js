const AWS = require('aws-sdk');
const moment = require("moment");
const crypto = require('crypto'),
    algorithm = 'aes-128-cbc',
    password = '1234567890abcdefghijklmnopqrstuv';
const rand = require("random-key");
const uuidv1 = require('uuid/v1');
const fResponse = require("../common/fResponse");
const sesAdapter = require("../adapter/SESAdapter");

AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { s3: '2006-03-01' };

const ses = new AWS.SES();


const docClient = new AWS.DynamoDB.DocumentClient();



//================================================================
const login = (result, fnCallback) => {


    logger.debug("Login Servisi Debug cagrildi")
    logger.info("Login Servisi Info cagrildi")


    var fResp = new FunctionResponse("login", [result, fnCallback]);
    var loginParamObj = result.req.body;
    var decPassword = encrypt(loginParamObj.password);
    var paramsOfLogin = {
        TableName: "GOLGI_USER",
        FilterExpression: "tckn = :tckn and sifre = :sifre",
        ExpressionAttributeValues: {
            ":tckn": loginParamObj.tckn,
            ":sifre": decPassword
        }
    };

    docClient.scan(paramsOfLogin, function(err, data) {
        if (err) {
            fResp.setErr(err);
        } else {
            if (data.Count != 0) {
                let item = data.Items[0];
                item.sifre = "***";
                item.tckn = "***";
                fResp.setData(item);
            } else {
                fResp.setErr("TC' niz ya da Şifre Yanlış");
            }
        }
        fnCallback(fResp);
    });
}

//================================================================
const register = (result, fnCallback) => {
    var fResp = new FunctionResponse("register", [result, fnCallback]);

    var registerParamObj = result.req.body;
    registerParamObj.sifre = encrypt(registerParamObj.sifre);
    var splitEmailArr = registerParamObj.eposta.split("@");
    var fkEmail = splitEmailArr[0] + "@finanskutusu.com";
    var activationKey = rand.generateBase30(5);

    var userID = uuidv1();
    var activeAccountRealID = uuidv1();

    var kayitTarihi = moment().format('YYYY/MM/DD-HH:mm:ss');
    var paramsOfRegister = {
        TableName: "GOLGI_USER",
        Item: {
            "userID": userID,
            "adSoyad": registerParamObj.adSoyad,
            "tckn": registerParamObj.tckn,
            "eposta": registerParamObj.eposta,
            "sifre": registerParamObj.sifre,
            "durum": "UnApproved",
            "kayitTarihi": kayitTarihi,
            "activeAccountRealID": activeAccountRealID,
            "activeAccountID": fkEmail,
            "activationKey": activationKey,
            "forgetPasswordKey": " "
        }
    };

    docClient.put(paramsOfRegister, function(err, data) {
        if (err) {
            fResp.setErr(err);
        } else {
            var respData = { data: data, insertedItem: paramsOfRegister.Item }
            fResp.setData(respData);
        }
        fnCallback(fResp);
    });
}

//================================================================
const allUser = (result, fnCallback) => {
    var fResp = new FunctionResponse("allUser", [result, fnCallback]);
    var paramsOfAllUser = {
        TableName: "GOLGI_USER"
    }

    docClient.scan(paramsOfAllUser, function(err, data) {
        if (err) fResp.setErr(err);
        else fResp.setData(data);
        fnCallback(fResp);
    });
}

//================================================================
const sendSimpleEmail4Register = (insertedItem, fnCallback) => {
    var fResp = new FunctionResponse("sendSimpleEmail4Register", [insertedItem, fnCallback]);

    var activationObjParam = {
        "userID": insertedItem.userID,
        "activationKey": insertedItem.activationKey
    };

    var activationURL = "activationURL + " + JSON.stringify(activationObjParam);

    //var a = "<a href='" + activationURL + "'>Hesabı Aktive Et..</a>";

    var sourceEmail = 'golgi@finanskutusu.com';
    var toEmail = insertedItem.eposta;
    var subjectData = "Finanskutusu.com Aktivasyon";
    var htmlData = "Doci' yi kullanabilmeniz için hesabınızı aktive etmeniz gerekmektedir.. " + "<a href='" + activationURL + "'>Hesabı Aktive Et..</a>";

    sesAdapter.sendSimpleEmail(sourceEmail, toEmail, subjectData, htmlData, (fResp) => {
        if (fResp.err != undefined) fResp.setErr(fResp.err);
        else fResp.setData(fResp.data);
        fnCallback(fResp);
    });
}

//================================================================
const getUser = (result, fnCallback) => {
    var fResp = new FunctionResponse("getUser", [result, fnCallback]);

    var activationParam = result.req.body;

    var params = {
        TableName: "GOLGI_USER",
    };

    fillScanParamObj(params, activationParam);
    docClient.scan(params, function(err, data) {
        if (err) fResp.setErr(err)
        else fResp.setData(data);
        fnCallback(fResp);
    });
}

//=================================================================
const fillScanParamObj = (paramsOfReq, paramObj) => {
    var FilterExpression = " ";
    var ExpressionAttributeValues = {};
    for (var key in paramObj) {
        FilterExpression += key + " = :" + key + " and ";
        ExpressionAttributeValues[":" + key] = paramObj[key];
    }

    FilterExpression = FilterExpression.slice(0, -4);

    paramsOfReq.FilterExpression = FilterExpression;
    paramsOfReq.ExpressionAttributeValues = ExpressionAttributeValues;
}

//================================================================
const updateUser = (result, fnCallback) => {
    var fResp = new FunctionResponse("updateUser", [result, fnCallback]);

    var reqParams = result.req.body;

    var params = {
        TableName: "GOLGI_USER",
        Key: {
            "userID": reqParams.userID
        },
        ReturnValues: "ALL_NEW"
    };

    fillUpdateParamObj(params, reqParams);
    docClient.update(params, function(err, data) {
        if (err) fResp.setErr(err)
        else fResp.setData(data);
        fnCallback(fResp);
    });
}

//================================================================
const fillUpdateParamObj = (paramsOfReq, paramObj) => {
    var UpdateExpression = "set ";
    var ExpressionAttributeValues = {};
    for (var key in paramObj) {
        if (key !== "userID") {
            UpdateExpression += key + " = :" + key + " and ";
            if (key === "forgetPasswordKey") {
                var forgetPasswordKey = rand.generateBase30(5);
                ExpressionAttributeValues[":" + key] = forgetPasswordKey;
            } else if (key === "sifre") {
                var sifre = encrypt(paramObj[key]);
                ExpressionAttributeValues[":" + key] = sifre;
            } else {
                ExpressionAttributeValues[":" + key] = paramObj[key];
            }
        }
    }

    UpdateExpression = UpdateExpression.slice(0, -4);

    paramsOfReq.UpdateExpression = UpdateExpression;
    paramsOfReq.ExpressionAttributeValues = ExpressionAttributeValues;
}


//================================================================
const sendEmail4ForgetPassword = (updatedItem, fnCallback) => {
    var fResp = new FunctionResponse("sendEmail4ForgetPassword", [updatedItem, fnCallback]);

    var forgetPasswordObjParam = {
        "userID": updatedItem.Attributes.userID,
        "forgetPasswordKey": updatedItem.Attributes.forgetPasswordKey
    };

    var forgetPasswordURL = "forgetPasswordURL" + JSON.stringify(forgetPasswordObjParam);

    //var a = "<a href='" + activationURL + "'>Hesabı Aktive Et..</a>";

    var sourceEmail = 'golgi@finanskutusu.com';
    var toEmail = updatedItem.Attributes.eposta;
    var subjectData = "Finanskutusu.com Aktivasyon";
    var htmlData = "Doci' den şifre talebinde bulundunuz.. Şifre yenilemek için linke tıklayarak devam ediniz.. " + "<a href='" + forgetPasswordURL + "'>Yeni Şifre Al</a>";

    sesAdapter.sendSimpleEmail(sourceEmail, toEmail, subjectData, htmlData, (fResp) => {
        if (fResp.err != undefined) fResp.setErr(fResp.err);
        else fResp.setData(fResp.data);
        fnCallback(fResp);
    });
}




//================================================================
function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    text = cipher.update(text, 'utf8', 'hex')
    text += cipher.final('hex');
    return text;
}




//================================================================
module.exports = {
    login,
    register,
    allUser,
    sendSimpleEmail4Register,
    getUser,
    updateUser,
    sendEmail4ForgetPassword
};