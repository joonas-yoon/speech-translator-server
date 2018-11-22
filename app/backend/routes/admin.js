var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  next();
});

// define the home page route
router.get('/', function(req, res) {
  res.send('Hello, admin').end();
});

module.exports = router;
