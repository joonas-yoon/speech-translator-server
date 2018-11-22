const express = require('express');
const passport = require('passport');

const router = express.Router();

// const User = require('../libs/user');

router.use(function(req, res, next) {
  console.log(req.user);
  next();
});

router.get('/login', function(req, res) {
  res.send('users').end();
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/?success'
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/?logout');
});

/*
router.get('/users', User.list);

router.get('/users/:id', function(req, res) {
  User.get(req, res);
});

router.post('/users', function(req, res) {
  User.create(req, res);
});

router.put('/users/:id', function(req, res) {
  User.update(req, res);
});

router.delete('/users/:id', function(req, res) {
  User.delete(req, res);
});
*/

module.exports = router;
