var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');
var port = process.env.PORT || 3000;
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var players = [];
var boardRows = 7;
var boardColumns = 7;

io.on('connection', (socket) => {
    console.log('a player connected');

    socket.on('player-login', (player) => {
        console.log(player.name + ' make login')
        players.push({
            name: player.name,
            color: player.color,
            x: 0,
            y: 0
        });
    });

    socket.on('walk-command', (msg) => {
        var player = players.filter(player => player.name == msg.name)[0];

        if (!player) return;
        console.log(msg);
        switch (msg.key) {
            case 'right':
                if (player.x + 1 < boardRows) {
                    player.x++;
                }
                break;
            case 'down':
                if (player.y + 1 < boardColumns) {
                    player.y++;
                }
                break;
            case 'left':
                if (player.x - 1 >= 0) {
                    player.x--;
                }
                break;
            case 'up':
                if (player.y - 1 >= 0) {
                    player.y--;
                }
                break;
        }

        // TODO: Check player identity
        //console.log('walk-command:' + msg);
        io.emit('players', players); // broadcast
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(port, () => {
  console.log('listening on *:3000');
});