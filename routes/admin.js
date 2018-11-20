var express = require('express');
var router = express.Router();

var Version = require('../libs/version');

router.use(function(req, res, next) {
  next();
});

// define the home page route
router.get('/', function(req, res) {
  res.send('Hello, admin').end();
});

router.get('/versions', Version.list);

router.get('/versions/latest', function(req, res) {
  Version.getLatest(req, res);
});

router.get('/versions/detail/:id', function(req, res) {
  Version.get(req, res);
});

router.post('/versions', function(req, res) {
  Version.create(req, res);
});

router.put('/versions/:id', function(req, res) {
  Version.update(req, res);
});

router.delete('/versions/:id', function(req, res) {
  Version.delete(req, res);
});

module.exports = router;
