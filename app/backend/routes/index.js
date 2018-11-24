var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  next();
});

router.use('/admin', require('./admin'));
router.use('/api', require('./api'));
router.use('/versions', require('./version'));

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = router;
