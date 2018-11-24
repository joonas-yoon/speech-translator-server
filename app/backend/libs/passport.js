const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(User.serialize);
  passport.deserializeUser(User.deserialize);
  passport.use(new LocalStrategy(User.authenticate()));

  return passport;
};
