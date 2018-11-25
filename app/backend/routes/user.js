const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../libs/user');
const Auth = require('../libs/auth');

router.use(function(req, res, next) {
  next();
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if(err || !user){
        return res.status(401).json(info);
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return next(error)
        const token = Auth.signToken({
          _id: user._id,
          username: user.username
        });
        return res.json({accessToken: token});
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.json({ message: 'logged out' });
});

router.get('/me', passport.authenticate('jwt', { session : false }), (req, res) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.accessToken
  })
});

router.post('/signup',
  passport.authenticate('signup', { session : false }),
  function (req, res, next) {
    res.json({
      message: 'Signup successful',
      user: req.user
    });
  }
);

module.exports = router;
