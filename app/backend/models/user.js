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
  generateRandomToken: function () {
    var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';

    for ( var x = 0; x < 16; x++ ) {
      var i = Math.floor( Math.random() * 62 );
      token += chars.charAt( i );
    }
    return token;
  }
};

/**
 * Statics
 */

UserSchema.statics.serialize = function (user, done){
  const model = mongoose.model('User')
  console.log('serialize', user)

  var createAccessToken = function() {
    var token = user.generateRandomToken()
    model.findOne({
      accessToken: token
    }, function(err, existingUser){
      if (err) return done(err)
      if (existingUser) {
          createAccessToken()
      } else {
        user.set('accessToken', token)
        user.save(function(err){
          if (err) return done(err)
          return done(null, token)
        })
      }
    })
  }

  if (user._id) {
    createAccessToken()
  }
};

UserSchema.statics.deserialize = function(token, done){
  const model = mongoose.model('User')
  console.log('deserialize', token)
  model.findOne({
    accessToken: token
  }, function(err, user){
    if (err) return done(err)
    done(null, user)
  })
};

/**
 * Plug-ins
 */
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
