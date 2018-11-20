var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    path = require('path'),
    ffmpegInstaller = require('@ffmpeg-installer/ffmpeg'),
    ffmpeg = require('fluent-ffmpeg'),
    configs = require('./configs'),
    record = require('node-record-lpcm16'),
    speech = require('@google-cloud/speech'),
    gstorage = require('@google-cloud/storage');

var uploader = multer({
  storage: multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

var PORT = 3000;
var CLOUD_BUCKET = configs.CLOUD_BUCKET;
var storage = gstorage({
  projectId: configs.projectId,
  keyFilename: configs.keyFilename
});
var bucket = storage.bucket(CLOUD_BUCKET);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

var mongoose = require('./libs/mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(methodOverride());

app.use('/admin', require('./routes/admin'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/collect',
  uploader.single('audio'),
  sendUploadToGCS, 
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

app.post('/translate',
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

app.get('/translate/supports', function (req, res) {
  // Imports the Google Cloud client library
  const Translate = require('@google-cloud/translate');

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

app.listen(PORT, function () {
  console.log(`[app] listening on port ${PORT}`);
});

function syncRecognize(filename, encoding, sampleRateHertz, languageCode, callback) {
  // [START speech_sync_recognize]
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

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


// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return res.status(500).json({error: 'No file uploaded'});
  }

  const gcsname = req.body.filename || (Date.now() + '-' + req.file.originalname);
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`;
      req.file.cloudStorageObjectUrl = `gs://${CLOUD_BUCKET}/${gcsname}`;
      next();
    });
  });

  stream.end(req.file.buffer);
}
// [END process]

function extractAudioToWav(req, res, next){
  const uploadDir = path.join(__dirname, 'uploads');
  const convertedFilename = path.join(uploadDir, req.file.cloudStorageObject + '.wav');

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
  // Imports the Google Cloud client library
  const Translate = require('@google-cloud/translate');

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
