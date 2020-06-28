class Client {
    constructor(game, clientConfigs, mainElements) {
        document.onkeydown = this.checkKey.bind(this);
        this.loginScreen = mainElements.loginScreen;
        this.gameScreen = mainElements.gameScreen;
        this.gameScreen.style.display='none';
        this.up = mainElements.mobileUp;
        this.up.onclick = () => { this.checkKey({keyCode: '38'}) }
        this.down = mainElements.mobileDown;
        this.down.onclick = () => { this.checkKey({keyCode: '40'}) }
        this.left = mainElements.mobileLeft;
        this.left.onclick = () => { this.checkKey({keyCode: '37'}) }
        this.right = mainElements.mobileRight;
        this.right.onclick = () => { this.checkKey({keyCode: '39'}) }


        this.game = game;
        this.ws = null;
        this.loggedIn = false;
        this.playerName = clientConfigs.playerName;
        this.playerId = '';
        this.currentRoomId = 0;
        this.playerMatrix = clientConfigs.playerMatrix;
        this.parser = new Parser(this);
        this.currentRoom = this.game.map.rooms[0];
        this.canMove = true;

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
        this.pingPong();
    }

    getPlayerLoginData() {
        let playerMatrix = JSON.stringify(this.playerMatrix);

        return `${Command.Login},`+
        `${this.playerName},`+
        `${this.getRandomPlayerColor()},`+
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
        if(this.canMove) {
            this.delayMove();

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
    }

    delayMove() {
        this.canMove = false;
        setTimeout(() => { this.canMove = true; }, 100);
    }

    getRandomPlayerColor() {
        return PlayerColors[Math.floor(Math.random() * PlayerColors.length)];
    }

    pingPong() {
        this.ws.send(`${Command.Ping}`);
        
        setTimeout(() => {
            this.pingPong();
        }, 20000);
    }
}