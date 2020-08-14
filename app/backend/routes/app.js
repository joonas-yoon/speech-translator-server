'use strict';

const fs = require('fs'),
      path = require('path'),
      multer = require('multer'),
      express = require('express'),
      ffmpegInstaller = require('@ffmpeg-installer/ffmpeg'),
      ffmpeg = require('fluent-ffmpeg'),
      speech = require('@google-cloud/speech'),
      {Translate} = require('@google-cloud/translate').v2,
      configs = require('../configs'),
      gcloud = require('../libs/gcloud');

const uploader = multer({
  storage: multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const WAV_DIRECTORY = path.join(__dirname, '..', 'uploads');

const router = express.Router();

router.use(function(req, res, next) {
  next();
});

router.post('/collect',
  uploader.single('audio'),
  gcloud.uploadToGCS({
    prefix: 'records/',
    bucket: configs.CLOUD_BUCKET1
  }),
  extractAudioToWav,
  function (req, res) {
    // console.log(req.file);
    console.log(req.body);

    var language_code = req.body.langcode || 'en-US';

    syncRecognize(
      req.file.convertedPath,
      'LINEAR16',
      48000,
      language_code,
      function (response){
        setTimeout(() => {
          // remove wav file
          fs.unlink(req.file.convertedPath, (err) => {
            if (err) console.error(err);
          });
        }, 60 * 1000);
        return res.json(response);
      }
    );
  }
);

router.post('/translate',
  function (req, res) {
    var src_lang = req.body.src_lang;
    var src_text = req.body.src_text;
    var dst_lang = req.body.dst_lang;

    if (!src_text) return res.status(404).end();

    translate_sentence(src_text, dst_lang, (results) => {
      return res.json(results);
    });
  }
);

router.get('/translate/supports', function (req, res) {
  // Instantiates a client
  const translate = new Translate(configs);

  // Lists available translation language with their names in English (the default).
  translate
    .getLanguages()
    .then(results => {
      return res.status(200).json(results[0]);
    })
    .catch(err => {
      console.error('ERROR:', err);
      return res.status(500).json({error: err});
    });
});

function syncRecognize(filename, encoding, sampleRateHertz, languageCode, callback) {
  // [START speech_sync_recognize]

  // Creates a client
  const client = new speech.SpeechClient(configs);

  const config = {
    enableAutomaticPunctuation: true,
    model: 'default',
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    content: fs.readFileSync(filename).toString('base64'),
    // uri: filename,
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: "${transcription}"`);
      callback(response);
    })
    .catch(err => {
      console.error('ERROR:', err);
      callback(err);
    });
  // [END speech_sync_recognize]
}

function extractAudioToWav(req, res, next){
  const filename = req.file.cloudStorageObject;
  const convertedFilename = path.join(WAV_DIRECTORY, filename.replace('/', '-') + '.wav');

  ffmpeg(req.file.cloudStoragePublicUrl)
    .toFormat('wav')
    .audioChannels(1)
    .audioBitrate('48k')
    .on('error', (err) => {
      console.log('An error occurred: ' + err.message);
      next(err);
    })
    .on('progress', (progress) => {
      // console.log(JSON.stringify(progress));
      console.log('Processing: ' + progress.targetSize + ' KB converted');
    })
    .on('end', (stdout, stderr) => {
      console.log('Processing finished !');
      req.file.convertedPath = convertedFilename;
      next();
    })
    .save(convertedFilename);
}

function translate_sentence(text, target_language, callback) {
  // Instantiates a client
  const translate = new Translate(configs);

  // Translates some text into Russian
  translate
    .translate(text, target_language)
    .then(results => {
      const translation = results[0];

      console.log(`Text: ${text}`);
      console.log(`Translation: ${translation}`);

      callback(results);
    })
    .catch(err => {
      console.error('ERROR:', err);
      callback(err);
    });
}

module.exports = router;
