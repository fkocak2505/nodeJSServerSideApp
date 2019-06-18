const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });
AWS.config.apiVersions = { s3: '2006-03-01' };

const s3Adapter = require(__dirname + "/../adapter/S3Adapter");


//================================================================
const getSamples = (result) => {
    s3Adapter.listBucketObjKeys("golgibucket", "examples_data/testfiles/", (fResp) => {
        if (fResp.err != undefined) {
            result.res.json({ success: false, error: err, msg: "Connection Error" });
            result.res.status(404).end();
        } else processKeysAndGenerateSampleJSON(result, fResp.data);
    });

}

const processKeysAndGenerateSampleJSON = (result, data) => {
    let mapOfSamples = {};
    data.forEach(item => {
        let itemObj = item;
        itemObj = itemObj.replace("examples_data/testfiles/", "");
        let arrPathItem = itemObj.split("/");
        let sampleKey, sampleDesc;
        if (arrPathItem.length > 3) console.log("Something problem with: " + item)

        if (arrPathItem.length > 1) {
            let docType = arrPathItem[0];
            let productType = arrPathItem[1];
            if (docType.length != 0 && productType.length != 0) {
                sampleKey = docType + "_" + productType + "_";
                sampleDesc = docType + "/" + productType;

                if (mapOfSamples[sampleKey] == undefined) mapOfSamples[sampleKey] = { samples: [], desc: sampleDesc };

            }
        }

        if (arrPathItem.length > 2) {
            let key = arrPathItem[2];
            if (key.length != 0) mapOfSamples[sampleKey].samples.push({ title: key.replace(sampleKey, ""), key: item, url: 'https://s3-eu-west-1.amazonaws.com/golgibucket/' + item });
        }

    })


    let samplesResult = { samplesGroups: [], account: "testuser" }
    let fIndex = 0;
    for (key in mapOfSamples) {
        fIndex++;
        let obj = mapOfSamples[key];
        obj.fIndex = fIndex;
        samplesResult.samplesGroups.push(obj);
    }

    result.res.json({ success: true, data: samplesResult });
    result.res.status(200).end();
}



//================================================================
const copySample2UploadsFolder = (result) => {
    let copyBucketOfParamObj = result.req.body;
    let filePathArr = copyBucketOfParamObj.filePath.split("/");
    let srcBucket = "golgibucket";
    let destBucket = "golgibucket";
    let srcKey = copyBucketOfParamObj.filePath;
    let destKey = "inputs/accounts/" + copyBucketOfParamObj.userName + "/uploads/" + filePathArr[filePathArr.length - 1];



    s3Adapter.copyItemToOtherBucket(srcBucket, destBucket, srcKey, destKey, fResp => {
        if (fResp.err != undefined) {
            result.res.json({ success: false, error: err, msg: "Connection Error" });
            result.res.status(404).end();
        } else {
            result.res.json({ success: true, data: fResp.data, msg: "Başarıyla kayıt edildi.." });
            result.res.status(200).end();

        }
    })
}



//================================================================
module.exports = {
    getSamples,
    copySample2UploadsFolder
};