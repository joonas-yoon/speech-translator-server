const express = require('express');

const Auth = require('../libs/auth');

const Router = express.Router();

Router.use(Auth.authenticate(), function (req, res, next) {
  console.log(req.path);
  next();
});

Router.use('/', require('./user'));

Router.use('/admin', require('./admin'));
Router.use('/app', require('./app'));
Router.use('/versions', require('./version'));

Router.get('/hello', function (req, res) {
  let greeting = 'Welcome!';
  if (req.user) greeting = 'Hello, ' + req.user.username + '!';
  res.json({
    text: greeting,
  });
});

Router.get('/ping', (req, res) => {
  res.json({
    result: true,
  });
});

module.exports = Router;
