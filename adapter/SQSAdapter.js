const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });



//================================================================
const purgeQueue = (queueURL, fnCallback) => {
    var params = {
        QueueUrl: queueURL
    };
    sqs.purgeQueue(params, function(err, data) {
        if (err) fnCallback(err)
        else fnCallback(data);
    });
}

module.exports = {
    purgeQueue
}