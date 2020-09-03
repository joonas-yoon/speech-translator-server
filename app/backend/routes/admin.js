const express = require('express');
const Router = express.Router();

Router.use(function (req, res, next) {
  next();
});

// define the home page route
Router.get('/', function (req, res) {
  res.send('Hello, admin').end();
});

module.exports = Router;
