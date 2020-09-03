const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');

const User = require('../libs/user');
const Auth = require('../libs/auth');

const Router = express.Router();

Router.use(function (req, res, next) {
  next();
});

Router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).json(info);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = Auth.signToken(user);
        return res.json({ accessToken: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

Router.get('/logout', function (req, res) {
  req.logout();
  res.json({ message: 'logged out' });
});

Router.get('/me', Auth.requireAuthenticated(), function (req, res) {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
  });
});

Router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  function (req, res, next) {
    res.json({
      message: 'Signup successful',
      user: req.user,
    });
  }
);

module.exports = Router;
