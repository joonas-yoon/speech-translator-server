const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');

const path = require('path');

exports.create = function(req, res, next){
  var user = new User({
    username: req.body.username
  });

  User.register(user, req.body.password, function(err, user) {
    if(err) return res.status(500).end();
    passport.authenticate('local')(req, res, next || function() {
      res.json({
        user: user
      });
    });
  });
};

exports.update = function(req, res){
  // ...
};

exports.get = function(req, res){
  res.status(404).end();
};
