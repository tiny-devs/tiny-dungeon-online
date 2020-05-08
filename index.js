var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a player connected');

    socket.on('walk-command', (msg) => {

        // TODO: Check player identity

        console.log('walk-command:' + msg);
        io.emit('walk-command', msg); // broadcast
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});