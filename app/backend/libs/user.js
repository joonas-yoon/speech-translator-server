const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

exports.create = function(req, res){
  var user = new User({
    username: req.body.username
  });

  User.register(user, req.body.password, function(err, user) {
    if(err) return res.status(500).end();
    passport.authenticate('local')(req, res, function() {
      res.json({user: user});
    });
  });
};

exports.update = function(req, res){
  // ...
};

exports.get = function(req, res){
  res.status(404).end();
};
