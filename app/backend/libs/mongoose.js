'use strict';

const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect(process.env.DB || '127.0.0.1');

// CONNECT TO MONGODB SERVER
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  console.info('[mongoose] Connected to mongod server');
});

// Load all models
const modelPath = path.join(__dirname, '..', 'models');
fs.readdirSync(modelPath).forEach(function (filename) {
  require(path.join(modelPath, filename));
});

module.exports = mongoose;
