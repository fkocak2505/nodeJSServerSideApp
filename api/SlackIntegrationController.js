const slackIntegrationService = require("../service/SlackIntegrationService");
const userService = require("../service/UserService");

const async = require('async');


const handleSlackAuthorization = (result) => {
    async.waterfall([
        function(callback) {
            slackIntegrationService.handleSlackAuthorization(result, (fResp) => {
                if (fResp.err !== undefined) {
                    result.res.json({ success: false, error: fResp.err });
                    result.res.status(404).end();
                } else {
                    callback(null, fResp.data);
                }
            })
        },
        function(slackAccessTokenArr, callback) {
            result.req.body = {};
            result.req.body["userID"] = slackAccessTokenArr[1];
            result.req.body["slackAccessToken"] = slackAccessTokenArr[0];
            userService.updateUser(result, (fResp) => {
                if (fResp.err !== undefined) {
                    result.res.json({ success: false, error: fResp.err });
                    result.res.status(404).end();
                } else {
                    result.res.writeHead(301, { Location: 'http://www.finanskutusu.com/integration.html?slackAccessToken=' + slackAccessTokenArr[1] + ":" + slackAccessTokenArr[2] });
                    result.res.end();
                }
            })
        }
    ], function(err) {
        console.log(err);
    })
}


//================================================================
module.exports = {
    handleSlackAuthorization
};