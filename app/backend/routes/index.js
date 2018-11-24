const express = require('express');

const router = express.Router();

router.use(function(req, res, next) {
  next();
});

router.use('/', require('./user'));

router.use('/admin', require('./admin'));
router.use('/api', require('./api'));
router.use('/versions', require('./version'));

router.get('/hello', function (req, res) {
  var greeting = 'Welcome!';
  if (req.user) greeting = 'Hello, ' + req.user.username + '!';
  res.json({
    text: greeting
  });
});

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = router;
