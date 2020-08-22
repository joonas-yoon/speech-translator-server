const express = require('express');
const multer = require('multer');

const Router = express.Router();

const Version = require('../libs/version');
const Gcloud = require('../libs/gcloud');
const configs = require('../configs');

const uploader = multer({
  storage: multer.MemoryStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // no larger than 15MB
  },
});

Router.use(function (req, res, next) {
  next();
});

Router.get('/', Version.list);

Router.get('/latest', function (req, res) {
  Version.getLatest(req, res);
});

Router.get('/download/:id', Version.download);

Router.get('/detail/:id', function (req, res) {
  Version.get(req, res);
});

Router.post(
  '/',
  uploader.single('zip'),
  Gcloud.uploadToGCS({
    prefix: 'versions/',
    bucket: configs.CLOUD_BUCKET2,
  }),
  Version.create
);

Router.put('/:id', function (req, res) {
  Version.update(req, res);
});

Router.delete('/:id', function (req, res) {
  Version.delete(req, res);
});

module.exports = Router;
