'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  identifier: { type : String, default: '', unique: true },
  description: { type: String, default: '' },
  filepath: { type: String, default: '' },
  filename: { type: String, default: '' },
  released: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

VersionSchema.path('identifier').required(true, 'Version identifier cannot be blank');

/**
 * Methods
 */

VersionSchema.methods = {

};

/**
 * Statics
 */

VersionSchema.statics = {

};

module.exports = mongoose.model('Version', VersionSchema);

