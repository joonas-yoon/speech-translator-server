const express = require('express'),
      multer = require('multer');

const router = express.Router();

const Version = require('../libs/version');
const Gcloud = require('../libs/gcloud');
const configs = require('../configs');

const uploader = multer({
  storage: multer.MemoryStorage,
  limits: {
    fileSize: 15 * 1024 * 1024 // no larger than 15MB
  }
});

router.use(function(req, res, next) {
  next();
});

router.get('/', Version.list);

router.get('/latest', function(req, res) {
  Version.getLatest(req, res);
});

router.get('/download/:id', Version.download);

router.get('/detail/:id', function(req, res) {
  Version.get(req, res);
});

router.post('/', 
  uploader.single('zip'),
  Gcloud.uploadToGCS({
    prefix: 'versions/',
    bucket: configs.CLOUD_BUCKET2
  }),
  Version.create
);

router.put('/:id', function(req, res) {
  Version.update(req, res);
});

router.delete('/:id', function(req, res) {
  Version.delete(req, res);
});

module.exports = router;
