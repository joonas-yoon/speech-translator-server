const express = require('express');
const passport = require('passport');

const router = express.Router();

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

module.exports = router;
