'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB || '127.0.0.1');

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.info("[mongoose] Connected to mongod server");
});

// Load all models
var models_path = path.join(__dirname, '..', 'models');
fs.readdirSync(models_path).forEach(function (filename) {
  require(path.join(models_path, filename));
})

module.exports = mongoose;
