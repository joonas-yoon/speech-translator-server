'use strict';

const { Storage } = require('@google-cloud/storage');

const configs = require('../configs');

const config = {
  projectId: configs.GCP_PROJECT_ID,
  keyFilename: configs.GCP_KEYFILENAME,
};

const storage = new Storage(config);

exports.config = config;

exports.uploadToGCS = function ({ prefix, bucket }) {
  const CLOUD_BUCKET = bucket || configs.CLOUD_BUCKET;
  const remoteBucket = storage.bucket(CLOUD_BUCKET);
  return (req, res, next) => {
    if (!req.file) {
      return res.status(500).json({ error: 'No file uploaded' });
    }

    const filePrefix = prefix || '';
    const filename =
      req.body.filename || Date.now() + '-' + req.file.originalname;
    const gcsname = filePrefix + filename;
    const file = remoteBucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      req.file.cloudStorageError = err;
      next(err);
    });

    stream.on('finish', () => {
      req.file.cloudStorageObject = gcsname;
      file.makePublic().then(() => {
        req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`;
        req.file.cloudStorageObjectUrl = `gs://${CLOUD_BUCKET}/${gcsname}`;
        next();
      });
    });

    stream.end(req.file.buffer);
  };
};
