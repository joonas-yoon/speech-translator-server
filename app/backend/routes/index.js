const express = require('express');
const path = require('path');

const router = express.Router();

router.use(function(req, res, next) {
  console.log(req.path)
  next();
});

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
