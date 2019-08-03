const express = require("express");
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const requireLogin = require("../middlewares/requireLogin");

const keys = require("../config/keys");

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    signatureVersion: "v4",
    region: "us-east-2"
});

module.exports = app => {
    app.get("/api/upload/", requireLogin, (req, res) => {
        //generate uniq string
        const key = `${req.user.id}/${uuid()}.jpeg`; //key is image name on Amazon S3
        s3.getSignedUrl(
            "putObject",
            {
                Bucket: "blog-image-nodejs",
                ContentType: "image/jpeg",
                Key: key
            },
            (err, url) => {
                res.send({ key, url });
            }
        );
    });
};
