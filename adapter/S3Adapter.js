const async = require('async');
const AWS = require('aws-sdk');
const fs = require("fs");

AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { s3: '2006-03-01' };

const s3 = new AWS.S3();
const fResponse = require("../common/fResponse");


//================================================================
const listBucketObjKeys = (bucketName, prefix, fnCallback) => {
    let params = { awsParams: { Bucket: bucketName, Prefix: prefix }, fnCallback: fnCallback, keyArr: [] }
    listS3ContentByPaging(params);
}


const listS3ContentByPaging = (params) => {
    this_fResp = new FunctionResponse("listS3ContentByPaging", [params]);
    s3.listObjectsV2(params.awsParams, function(err, data) {
        if (err) {
            this_fResp.setErr(err);
            params.fnCallback(this_fResp);
        } else {
            if (data.Contents.length > 0) {
                data.Contents.forEach((elem, index) => { params.keyArr.push(elem.Key) });
                params.awsParams.StartAfter = data.Contents[data.Contents.length - 1].Key;
                listS3ContentByPaging(params);
            } else {
                this_fResp.setData(params.keyArr);
                params.fnCallback(this_fResp);
            }
        }
    });
}



//================================================================
const copyItemToOtherBucket = (srcBucket, destBucket, srcKey, destKey, fnCallback) => {

    this_fResp = new FunctionResponse("copyItemToOtherBucket", [srcBucket, destBucket, srcKey, destKey, fnCallback]);

    var params = {
        Bucket: destBucket, //Destination
        CopySource: "/" + srcBucket + "/" + srcKey,
        Key: destKey
    };

    s3.copyObject(params, function(err, data) {
        if (err) this_fResp.setErr(err);
        else this_fResp.setData(data); // successful response
        fnCallback(this_fResp);
    });
}




//================================================================
const deleteBucketItem = (bucketName, item, fnCallback) => {
    var params = {
        Bucket: bucketName,
        Key: item
    };

    this_fResp = new FunctionResponse("deleteBucketItem", [bucketName, item, fnCallback]);
    s3.deleteObject(params, function(err, data) {
        if (err) this_fResp.setErr(err);
        else this_fResp.setData(data);
        fnCallback(this_fResp);
    });
}


//================================================================
const putLocalFile2S3Bucket = (filePath, bucket, key, fnCallback) => {
    this_fResp = new FunctionResponse("putLocalFile2S3Bucket", [filePath, bucket, key, fnCallback]);

    fs.readFile(filePath, (err, data) => {
        if (err != undefined) {
            this_fResp.setErr(err);
            fnCallback(this_fResp);
        } else {
            var params = {
                Body: data,
                Bucket: bucket,
                Key: key
            };
            s3.putObject(params, function(err, data) {
                if (err) {
                    this_fResp.setErr(err);
                    fnCallback(this_fResp);
                } else {
                    this_fResp.setData(data);
                    fs.unlink(filePath, function(err) {
                        if (!err) {
                            fnCallback(this_fResp);
                        } else {
                            this_fResp.setErr(err);
                            fnCallback(this_fResp);
                        }
                    });

                }
            });
        }

    });
}


//================================================================
module.exports = {
    listBucketObjKeys,
    copyItemToOtherBucket,
    deleteBucketItem,
    putLocalFile2S3Bucket,
};