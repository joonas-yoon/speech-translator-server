// configs/index.js

const path = require('path');

const configs = {

  projectId: process.env.GCP_PROJECT_ID || '<project id>',

  keyFilename: process.env.GCP_KEYFILENAME || path.join(__dirname, '..', 'key.json'),

  CLOUD_BUCKET: process.env.GCP_CLOUD_BUCKET || '<google cloud bucket name>'

};

module.exports = configs;
