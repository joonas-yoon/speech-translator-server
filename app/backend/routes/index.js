var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  next();
});

router.use('/admin', require('./admin'));
router.use('/api/', require('./api'));
router.use('/versions', require('./version'));

router.get('/', function (req, res) {
  res.send('Hello World!');
});

module.exports = router;
