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
        this.playerListElement = mainElements.playerListElement;
        this.loginScreen = mainElements.loginScreen;
        this.gameScreen = mainElements.gameScreen;
        this.gameScreen.style.display='none';

        this.game = game;
        this.ws = null;
        this.loggedIn = false;
        this.playerName = clientConfigs.playerName;
        this.playerMatrix = clientConfigs.playerMatrix;
        this.playerList = [];

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
        try {
            const receivedData = data.split(',');
            
            switch (+receivedData[0]) {
                case Command.Login:
                    this.game.applyServerRules(receivedData);
                    this.initPlayers(this.getPlayerListFromData(data));
                    break
                case Command.Move:
                    this.updatePlayer(receivedData);
                    break
            }

        } catch(e) {
            if(data != 'pong') {
                console.log(e)
            }
        }
    }

    //this will be much prettier when we have the parser, sorry
    getPlayerListFromData(data) {
        let rawDataString = data;
        let listString = '';
        if (data.includes(',[')) {
          rawDataString = data.substr(0, data.indexOf(',['));
          listString = data.substr(data.indexOf('['), data.length);
        }
        const eventData = rawDataString.split(',')
        return JSON.parse(listString);
    }

    initPlayers(players) {
        this.game.addPlayers(players);
        this.drawSprites();
    }

    updatePlayer(data) {
        for(const player of this.game.players) {
            if (player.id == data[1]) {
                player.move(data[2], data[3]);
            }
        }
        this.drawSprites();
    }

    drawSprites() {
        while(this.playerListElement.firstChild){
            this.playerListElement.removeChild(this.playerListElement.firstChild);
        }
    
        this.game.spritesLayer.clear();

        this.game.players.forEach(player => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(player.name));
            li.style.color = player.color;
            this.playerListElement.appendChild(li);

            player.draw();
        });
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