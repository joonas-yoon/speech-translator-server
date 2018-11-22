var express = require('express');
var router = express.Router();

var Version = require('../libs/version');

router.use(function(req, res, next) {
  next();
});

router.get('/', function(req, res) {
  res.send('Hello, admin').end();
});

router.get('/', Version.list);

router.get('/latest', function(req, res) {
  Version.getLatest(req, res);
});

router.get('/detail/:id', function(req, res) {
  Version.get(req, res);
});

router.post('/', function(req, res) {
  Version.create(req, res);
});

router.put('/:id', function(req, res) {
  Version.update(req, res);
});

router.delete('/:id', function(req, res) {
  Version.delete(req, res);
});

module.exports = router;
