const AWS = require('aws-sdk');
const async = require('async');
const uuidv1 = require('uuid/v1');
const moment = require('moment');

AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { s3: '2006-03-01' };
const s3Adapter = require(__dirname + "/../adapter/S3Adapter");




//================================================================================
const uploadDoc = (result) => {

    let req = result.req;
    let res = result.res;
    let objOfUserName = JSON.parse(req.query.jp)

    var regex4SpecialCharecter = /[-!$%^&*()_+|~=`{} [:;<>?,@#\]]/g;

    let tmp_path = req.file.path;
    console.log("FileUploadS3 Run:" + tmp_path)

    let accountPath = "inputs/accounts/" + objOfUserName.username + "/uploads/";
    var fileName = req.file.originalname;
    fileName = fileName.replace(regex4SpecialCharecter,''); //// regex işleminden geçirilmezse golgi engine tarafında türkçe karakter sorunu yaşanıyor..
    let key = accountPath + req.file.originalname;
    let bucket = "golgibucket";

    console.log("Put File to S3 Bucket: " + bucket + " with key: " + key);
    s3Adapter.putLocalFile2S3Bucket(tmp_path, bucket, key, (fResp) => {
        if (fResp.err != undefined) {
            res.json({ msg: 'failed' });
            res.status(200).end();
        } else {
            res.json({ msg: 'success' });
            res.status(200).end();
        }
    });

}



module.exports = {
    uploadDoc
}