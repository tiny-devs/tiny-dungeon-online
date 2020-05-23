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
    constructor(game) {
        document.onkeydown = this.checkKey.bind(this);
        this.playerListElement = document.getElementById("player-list");
        this.textDisplay = document.getElementById("text-display");
        this.playerNameInput = document.getElementById("player-name");
        this.confirmBtn = document.getElementById("confirm-btn")
        this.canvasElement = document.getElementById("canvas");
        this.canvasElement.style.display="none";

        this.game = game;
        this.ws = null;
        this.loggedIn = false;
        this.playerName = '';
        this.playerList = [];
        this.confirmBtn.onclick = () => { this.onConfirmName() };
    }

    initWebSocket() {
        this.ws.onopen = () => this.successfulConection()
        this.ws.addEventListener('message', this.onReceiveMessage.bind(this))
    }

    successfulConection() {
        this.ws.send(`${Command.Login},${this.playerName},${this.getRandomColor()}`);
        this.canvasElement.style.display="block";
        this.playerNameInput.style.display="none";
        this.confirmBtn.style.display="none";
        this.textDisplay.style.display="none";
        this.loggedIn = true;
        this.pingPong();
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

    // esse metodo nao vai ser necessario quando tivermos classes de packets e parsers
    getPlayerListFromData(data) {
        let listString = '';
        let isList = false;

        for (const c of data) {
            if (c == '[') {
                isList = true;
            }
            if (isList) {
                listString = listString.concat(c);
                if (c == ']') {
                    isList = false;
                }
            }
        }
        return JSON.parse(listString);
    }

    initPlayers(players) {
        this.game.addPlayers(players);
        this.drawEntities();
    }

    updatePlayer(data) {
        for(const player of this.game.players) {
            if (player.id == data[1]) {
                player.move(data[2], data[3]);
            }
        }
        this.drawEntities();
    }

    drawEntities() {
        while(this.playerListElement.firstChild ){
            this.playerListElement.removeChild(this.playerListElement.firstChild);
        }
    
        this.game.ctx.clearRect(0, 0, this.game.c.width, this.game.c.height);
        this.game.board.draw();

        this.game.players.forEach(player => {
            var li = document.createElement("li");
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

    onConfirmName() {
        this.playerName = this.playerNameInput.value;
    
        if (this.playerName) {
            let socketProtocol = 'wss'
            if (location.protocol !== 'https:') {
                socketProtocol = 'ws'
            }
            this.ws = new WebSocket(`${socketProtocol}://${window.location.host}/ws`);
            this.initWebSocket();
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
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