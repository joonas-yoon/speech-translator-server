'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registered_at: { type: Date, default: Date.now },
});

UserSchema.path('username').required(true, 'Username cannot be blank');

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

/**
 * Methods
 */

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const match = await bcrypt.compare(password, user.password);
  return match;
};

/**
 * Statics
 */

UserSchema.statics = {};

module.exports = mongoose.model('User', UserSchema);
