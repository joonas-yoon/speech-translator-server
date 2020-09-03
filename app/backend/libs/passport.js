const passport = require('passport');
const mongoose = require('mongoose');

const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const UserModel = mongoose.model('User');
const Auth = require('./auth');

module.exports = function (app) {
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: Auth.getSecret(),
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      },
      async (payload, done) => {
        UserModel.findById(payload.id)
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );

  //Create a passport middleware to handle user registration
  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        UserModel.create({ username, password }, (err, user) => {
          if (err || !user) return done(err);
          return done(null, user);
        });
      }
    )
  );

  //Create a passport middleware to handle User login
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        UserModel.findOne({ username }, async (err, user) => {
          if (err || !user) {
            return done(err, false, { message: 'User not found' });
          }

          const validate = await user.isValidPassword(password);
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }

          return done(null, user, { message: 'Logged in Successfully' });
        });
      }
    )
  );

  return passport;
};
