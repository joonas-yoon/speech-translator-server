var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    path = require('path');

var uploadDir = path.join(__dirname, '/..', '/uploads/');
var uploader = multer({ dest: uploadDir });

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('method-override')());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/collect', uploader.single('audio'), function (req, res) {
  console.log(req.file);
  res.json(req.body);
});

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
}, 5 * 1000);

