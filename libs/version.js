const mongoose = require('./mongoose');
const Version = mongoose.model('Version');

exports.create = function(req, res){
  console.log('create');
  res.end();
};

exports.update = function(req, res){
  console.log('update');
  res.end();
};

exports.read = function(req, res){
  console.log('read');
  res.end();
};

exports.delete = function(req, res){
  console.log('delete');
  res.end();
};

exports.list = function(req, res){
  console.log('list');
  Version.find({}, function(err, list){
    if(err) {
        res.status(500).end();
    }
    res.json(list);
  });
};
