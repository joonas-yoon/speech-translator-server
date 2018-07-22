var http = require('http');
var express = require('express');
var app = express();

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
