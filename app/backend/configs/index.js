// configs/index.js

const path = require('path');

const configs = {
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || '<project id>',

  GCP_KEYFILENAME: path.join(
    __dirname,
    '..',
    process.env.GCP_KEYFILENAME || 'key.json'
  ),

  CLOUD_BUCKET: process.env.GCP_CLOUD_BUCKET || '<google cloud bucket name>',
};

module.exports = configs;
