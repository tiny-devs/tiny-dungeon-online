const Player = require('./entities/player');

class Server {
    constructor(serverConfigs) {
        this.app = require('express')();
        this.http = require('http').createServer(this.app);
        this.io = require('socket.io')(this.http);
        this.express = require('express');
        this.indexPath = serverConfigs.indexPath;
        this.port = process.env.PORT || serverConfigs.port;
        this.players = [];
        this.boardRows = serverConfigs.boardRows;
        this.boardColumns = serverConfigs.boardColumns;

        this.serveClientFiles(serverConfigs.staticClientFolderName);
        this.setSocketListenersRules();
        this.startListening();
    }

    setStaticClientFolder(folder) {
        this.app.use(this.express.static(folder));
    }

    serveClientFiles(folder) {
        this.setStaticClientFolder(folder);

        this.app.get('/', (req, res) => {
            res.sendFile(this.indexPath);
        }).bind(this);
    }

    setSocketListenersRules() {
        this.io.on('connection', (socket) => {
            console.log('a player connected');
        
            socket.on('player-login', (player) => {
                if (player.name == 'reset') {
                    this.players = [];
                    return;
                }
        
                console.log(player.name + ' make login');
        
                const newPlayer = new Player(socket.id, player.name, player.color, 0, 0);
                this.players.push(newPlayer);
            });
        
            socket.on('walk-command', (msg) => {
                var player = this.players.filter(player => player.name == msg.name)[0];
        
                if (!player) return;

                player.move(msg.key, this.boardRows, this.boardColumns);
        
                // TODO: Check player identity
                //console.log('walk-command:' + msg);
                this.io.emit('players', this.players); // broadcast
            });
        
            socket.on('disconnect', () => {
                this.players = this.players.filter(player => player.id != socket.id);
                console.log('player [' + socket.id + '] disconnected ');
            });
        });
    }

    startListening() {
        this.http.listen(this.port, () => {
            console.log('listening on *:3000');
        });
    }
}

module.exports = Server;