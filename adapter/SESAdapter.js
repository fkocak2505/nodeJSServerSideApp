const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { ses: '2010-12-01' };
const fResponse = require("../common/fResponse");
const ses = new AWS.SES();

//================================================================
function sendSimpleEmail(sourceEmail, toEmail, subjectData, htmlData, fnCallback) {
    var params = {
        Destination: {
            ToAddresses: [toEmail]
        },
        Message: {
            Body: {
                Html: { Data: htmlData }
            },
            Subject: {
                Data: subjectData,
                Charset: 'UTF-8'
            }
        },
        Source: sourceEmail
    }

    var fResp = new FunctionResponse("sendSimpleEmail", [fnCallback]);
    ses.sendEmail(params, function(err, data) {
        if (err) fResp.setErr(err);
        else fResp.setData(data);
        fnCallback(fResp);
    });

}


//================================================================
module.exports = {
    sendSimpleEmail
}