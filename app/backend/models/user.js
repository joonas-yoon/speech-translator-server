'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type : String, unique: true },
  password: { type: String },
  registered_at: { type: Date, default: Date.now }
});

UserSchema.path('username').required(true, 'Username cannot be blank');

/**
 * Methods
 */

UserSchema.methods = {

};

/**
 * Statics
 */

UserSchema.statics = {

};

module.exports = mongoose.model('User', UserSchema);

