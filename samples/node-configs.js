// configs/index.js

const path = require('path');

const configs = {

  projectId: process.env.projectId || '<project id>',

  keyFilename: process.env.keyFilename || path.join(__dirname, '..', 'key.json'),

  CLOUD_BUCKET: '<google cloud bucket name>'

};

module.exports = configs;
