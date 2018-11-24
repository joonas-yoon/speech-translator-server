const express = require('express');
const passport = require('passport');

const router = express.Router();

const User = require('../libs/user');

router.use(function(req, res, next) {
  next();
});

router.post('/login', requireAuthenticated, function(req, res) {
  res.json({ user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.json({ message: 'logged out' });
});

router.get('/me', requireAuthenticated, function(req, res) {
  User.me(req, res);
});

router.post('/user', function(req, res) {
  User.create(req, res);
});

function requireAuthenticated(req, res, next) {
  passport.authenticate('local', {
    failureFlash: true
  })(req, res, next);
}

module.exports = router;
