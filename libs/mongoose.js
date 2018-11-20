'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

module.exports = mongoose;
