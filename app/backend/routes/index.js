var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use('/', require('./user'));

router.use('/admin', require('./admin'));
router.use('/api', require('./api'));
router.use('/versions', require('./version'));

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/hello', function (req, res) {
  res.json({
    text: 'Hello!'
  });
});

module.exports = router;
