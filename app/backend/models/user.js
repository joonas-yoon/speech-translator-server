'use strict';

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type : String, unique: true },
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

/**
 * Plug-ins
 */
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
