const express = require('express');
const path = require('path');

const Auth = require('../libs/auth');

const router = express.Router();

router.use(
  Auth.authenticate(),
  function(req, res, next) {
    console.log(req.path)
    next();
  }
);

router.use('/', require('./user'));

router.use('/admin', require('./admin'));
router.use('/app', require('./app'));
router.use('/versions', require('./version'));

router.get('/hello', function (req, res) {
  var greeting = 'Welcome!';
  if (req.user) greeting = 'Hello, ' + req.user.username + '!';
  res.json({
    text: greeting
  });
});

module.exports = router;
