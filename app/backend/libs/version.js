const mongoose = require('mongoose'),
      gcloud = require('./gcloud');

const Version = mongoose.model('Version');

exports.create = function(req, res){
  var version = new Version();
  version.identifier = req.body.identifier;
  version.description = req.body.description || '';
  version.public_url = req.file.cloudStoragePublicUrl || '';
  version.object_url = req.file.cloudStorageObjectUrl || '';

  version.save(function(err){
    if(err){
      console.error(err);
      res.status(500).json({result: false});
      return;
    }
    res.json({result: true, file: version});
  });
};

exports.update = function(req, res){
  var identifier = req.params.id;
  Version.findOne({identifier: identifier}, function(err, version){
    if(err) return res.status(500).json({ error: 'database failure' });
    if(!version) return res.status(404).json({ error: 'not found' });

    if(req.body.identifier) {
      version.identifier = req.body.identifier;
    }

    if(req.body.description) {
      version.description = req.body.description;
    }

    if(req.body.released) {
      version.released = req.body.released;
    }

    version.updated_at = new Date();

    version.save(function(err){
      if(err) return res.status(500).json({error: 'failed to update'});
      res.json({result: true, message: 'updated'});
    });
  });
};

exports.get = function(req, res){
  var identifier = req.params.id;
  Version.findOne({
    identifier: identifier
  }, {
    '_id': false,
    'object_url': false
  }, function(err, version){
    if(err) return res.status(500).end();
    res.json(version);
  });
};

exports.delete = function(req, res){
  var identifier = req.params.id;
  Version.remove({identifier: identifier}, function(err, out){
    if(err) return res.status(500).json({ error: "database failure" });
    // No Content (success to delete)
    res.status(204).end();
  });
};

exports.list = function(req, res){
  Version.find({}, function(err, list){
    if(err) return res.status(500).end();
    res.json(list);
  });
};

exports.getLatest = function(req, res){
  Version
    .find({released: true})
    .select({'_id': false, 'object_url': false})
    .sort('-created_at -identifier')
    .findOne({}, function(err, version){
      if(err) return res.status(500).end();
      res.json(version);
    });
};

exports.download = function(req, res){
  var identifier = req.params.id;
  Version.findOne({
    identifier: identifier,
    released: true
  }, function(err, version){
    if(err) return res.status(500).end();
    if(!version || !version.public_url) return res.status(404).end();
    res.redirect(version.public_url);
  });
};

