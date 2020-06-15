const Direction = {
    "Up": 1,
    "Down": 2,
    "Left": 3,
    "Right": 4
}

const Command = {
    "Login": 1,
    "Move": 2,
    "Ping": 3,
    "Pong": 4
}

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
        this.playerMatrix = clientConfigs.playerMatrix;
        this.playerList = [];
        this.parser = new Parser(this);

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
                player.move(moveData.x, moveData.y);
            }
        }
        this.drawSprites();
    }

    drawSprites() {
        this.game.spritesLayer.draw();
    }

    checkKey(e) {
        if (this.loggedIn) {
            if (e.keyCode == '38' || e.keyCode == '87') {
                this.ws.send(`${Command.Move},${Direction.Up}`);
            } else if (e.keyCode == '40' || e.keyCode == '83') {
                this.ws.send(`${Command.Move},${Direction.Down}`);
            } else if (e.keyCode == '37' || e.keyCode == '65') {
                this.ws.send(`${Command.Move},${Direction.Left}`);
            } else if (e.keyCode == '39' || e.keyCode == '68') {
                this.ws.send(`${Command.Move},${Direction.Right}`);
            }
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

class Parser {
    constructor(client) {
        this.client = client;
    }

    parse(data) {
        try {
            const command = +data.split(',')[0];

            switch (command) {
                case Command.Login:
                    this.parseLogin(data);
                    break
                case Command.Move:
                    this.parseMove(data);
                    break
            }

        } catch(e) {
            console.log(e)
        }
    }

    parseLogin(data) {
        const loginData = new ParseLogin(data);

        this.client.game.applyServerRules(loginData.serverRules);
        this.client.game.spritesLayer.addPlayers(loginData.players);
        this.client.drawSprites();
    }

    parseMove(data) {
        const moveData = new ParseMove(data);

        this.client.updatePlayer(moveData);
    }
}

class ParseLogin {
    constructor(data) {
        const loginData = this.parseString(data)

        this.playerId = loginData[1];
        this.serverRules = {
            boardRows: loginData[2],
            boardColumns: loginData[3]
        }
        this.players = JSON.parse(loginData[4]);
    }

    parseString(eventDataString) {
        let rawDataString = eventDataString;
        let matrix = '';
        rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['));
        matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length);

        let eventData = rawDataString.split(',');
        eventData.push(matrix);

        return eventData;
    }
}

class ParseMove {
    constructor(data) {
        const moveData = this.parseString(data);

        this.playerId = moveData[1];
        this.x = moveData[2];
        this.y = moveData[3];
    }

    parseString(eventDataString) {
        return eventDataString.split(',');
    }
}