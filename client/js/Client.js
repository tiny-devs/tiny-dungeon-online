class Client {
    constructor(game, clientConfigs, mainElements) {
        document.onkeydown = this.checkKey.bind(this);
        this.loginScreen = mainElements.loginScreen;
        this.gameScreen = mainElements.gameScreen;
        this.gameScreen.style.display='none';

        this.game = game;
        this.ws = null;
        this.loggedIn = false;
        this.playerName = clientConfigs.playerName;
        this.playerId = '';
        this.currentRoomId = 0;
        this.playerMatrix = clientConfigs.playerMatrix;
        this.parser = new Parser(this);
        this.currentRoom = this.game.map.rooms[0];

        this.setupWebSocket();
    }

    setupWebSocket() {
        let socketProtocol = 'wss'
        if (location.protocol !== 'https:') {
            socketProtocol = 'ws'
        }
        this.ws = new WebSocket(`${socketProtocol}://${window.location.host}/ws`);
        this.initWebSocket();
    }

    initWebSocket() {
        this.ws.onopen = () => this.successfulConection();
        this.ws.addEventListener('message', this.onReceiveMessage.bind(this));
    }

    successfulConection() {
        this.ws.send(this.getPlayerLoginData());
        this.gameScreen.style.display='block';
        this.loginScreen.style.display='none';
        this.loggedIn = true;
        this.pingPong();
    }

    getPlayerLoginData() {
        let playerMatrix = JSON.stringify(this.playerMatrix);

        return `${Command.Login},`+
        `${this.playerName},`+
        `${this.getRandomColor()},`+
        `${playerMatrix}`;
    }

    onReceiveMessage(event) {
        const data = event.data;
        this.parser.parse(data);
    }

    updatePlayer(moveData) {
        for(const player of this.game.spritesLayer.players) {
            if (player.id == moveData.playerId) {
                if (this.playerId == moveData.playerId) {
                    if (moveData.currentRoomId != this.currentRoomId) {
                        this.drawRoom(moveData.currentRoomId);
                        this.currentRoomId = moveData.currentRoomId;
                    }
                }
                player.move(moveData.x, moveData.y, moveData.currentRoomId);
            }
        }
        this.drawSprites();
    }

    drawRoom(roomId) {
        this.currentRoom.clear();
        this.currentRoom = this.game.map.getRoomById(roomId);
        this.currentRoom.draw();
    }

    drawSprites() {
        this.game.spritesLayer.draw(this.currentRoomId);
    }

    checkKey(e) {
        let direction = 0;        
        if (e.keyCode == '38' || e.keyCode == '87') {
            direction = Direction.Up;
        } else if (e.keyCode == '40' || e.keyCode == '83') {
            direction = Direction.Down;
        } else if (e.keyCode == '37' || e.keyCode == '65') {
            direction = Direction.Left;
        } else if (e.keyCode == '39' || e.keyCode == '68') {
            direction = Direction.Right;
        }

        const player = this.game.spritesLayer.getPlayerById(this.playerId);
        const isValidMove = player.isValidMove(direction, this.currentRoom.solidLayerShape);

        if (this.loggedIn && isValidMove) {
            this.ws.send(`${Command.Move},${direction}`);
        }
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    pingPong() {
        this.ws.send(`${Command.Ping}`);
        
        setTimeout(() => {
            this.pingPong();
        }, 20000);
    }
}