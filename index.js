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

var CLOUD_BUCKET = configs.CLOUD_BUCKET;
var storage = gstorage({
  projectId: configs.projectId,
  keyFilename: configs.keyFilename
});
var bucket = storage.bucket(CLOUD_BUCKET);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(methodOverride());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/collect',
  uploader.single('audio'),
  sendUploadToGCS, 
  extractAudioToWav,
  function (req, res) {
    console.log(req.file);

    syncRecognize(
      req.file.convertedPath,
      'LINEAR16',
      48000,
      'en-US',
      function (response){
        return res.json(response);
      }
    );
  }
);

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});

// Socket connection
// Creates new HTTP server for socket
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080, function(){
  console.log('Socket server listening on : 8080');
});

let
    sequenceNumberByClient = new Map();

// event fired every time a new client connects:
io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);

    // when socket disconnects, remove it from the list:
    socket.on('disconnect', () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
});

// sends each client its current sequence number
setInterval(() => {
    // console.log('emit function!');
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit('counter', sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 500 * 1000);


function syncRecognize(filename, encoding, sampleRateHertz, languageCode, callback) {
  // [START speech_sync_recognize]
  // Imports the Google Cloud client library
  const fs = require('fs');
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
    return next();
  }

  const gcsname = Date.now() + '-' + req.file.originalname;
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
  const uploadDir = path.join(__dirname, '/..', 'uploads');
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
