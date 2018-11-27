// configs/index.js

const path = require('path');

const configs = {

  projectId: process.env.GCP_PROJECT_ID,

  keyFilename: path.join(__dirname, '..', process.env.GCP_KEYFILENAME || 'key.json'),

  CLOUD_BUCKET1: process.env.GCP_CLOUD_BUCKET1,
  CLOUD_BUCKET2: process.env.GCP_CLOUD_BUCKET2

};

module.exports = configs;
