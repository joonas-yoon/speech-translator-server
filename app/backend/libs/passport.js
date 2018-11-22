const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('./mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, callback) {
    callback(null, user.id);
  });

  passport.deserializeUser(function(id, callback) {
    User.findById(id, function(err, user) {
      callback(err, user);
    }); 
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

  return passport;
};
