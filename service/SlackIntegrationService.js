const fResponse = require("../common/fResponse");
const url = require('url');
const winston = require('winston');
const { WebClient } = require('@slack/client');

const userService = require("../service/UserService");


const handleSlackAuthorization = (result, fnCallback) => {
    var fResp = new FunctionResponse("handleSlackAuthorization", [result, fnCallback]);

    const myURL = url.parse(result.req.url, true);
    let code = myURL.query.code;
    let userID = myURL.query.state;
    console.log("Code:" + code);
    if (code != undefined) {
        getAccessToken(code, userID, fnCallback);
    } else {
        fResp.setErr("Code undefined" + result.req.url);
        fnCallback(fResp);
    }
}

const getAccessToken = (code, userID, fnCallback) => {
    var fRespV = new FunctionResponse("handleSlackAuthorization_getAccessToken", [fnCallback]);

    const client = new WebClient();
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';

    // Not shown: did some OAuth to recieve `code` grant
    client.oauth.access({
            client_id: clientId,
            client_secret: clientSecret,
            code
        })
        .then((res) => {
            console.log(res.access_token);
            var fRespX = new FunctionResponse("handleSlackAuthorization_getAccessToken_updateUser", [fnCallback]);
            fRespX.setData([res.access_token, userID]);
            fnCallback(fRespX);
        })
        .catch(function(err) {
            fRespV.setErr(err);
            fnCallback(fRespV);
        });



}

//================================================================
module.exports = {
    handleSlackAuthorization
};