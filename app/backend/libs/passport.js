const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const UserModel = mongoose.model('User');
const Auth = require('./auth');

module.exports = function(app) {

  // app.use(passport.initialize());

  passport.use(new JWTstrategy({
    secretOrKey : Auth.getSecret(),
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter('accessToken')
  }, async (token, done) => {
    try {
      //Pass the user details to the next middleware
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));

  //Create a passport middleware to handle user registration
  passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    UserModel.create({ username, password }, (err, user) => {
      if( err || !user ) return done(err)
      return done(null, user);
    });
  }));

  //Create a passport middleware to handle User login
  passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    try {
      UserModel.findOne({ username }, (err, user) => {
        if( err || !user ){
          return done(null, false, {message : 'User not found'});
        }

        const validate = user.isValidPassword(password);
        if( !validate ){
          return done(null, false, {message : 'Wrong Password'});
        }
        return done(null, user, {message : 'Logged in Successfully'});
      });
    } catch (error) {
      return done(error);
    }
  }));

  return passport;
};
