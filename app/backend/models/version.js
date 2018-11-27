'use strict';

const mongoose = require('mongoose');
const path = require('path');

const Schema = mongoose.Schema;

const VersionSchema = new Schema({
  identifier: { type : String, default: '', unique: true },
  description: { type: String, default: '' },
  public_url: { type: String, default: '' },
  object_url: { type: String, default: '' },
  released: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

VersionSchema.path('identifier').required(true, 'Version identifier cannot be blank');

VersionSchema.pre('save', function(next){
  var current = new Date();

  if( !this.object_url ) {
    this.object_url = this.identifier + '-' + current.getTime();
  }

  this.created_at = current;
  this.updated_at = current;

  next();
});

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

