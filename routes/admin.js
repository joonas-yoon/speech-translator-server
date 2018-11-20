var express = require('express');
var router = express.Router();

var Version = require('../libs/version');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', function (req, res) {
  Version.list(req, res);
});

module.exports = router;
