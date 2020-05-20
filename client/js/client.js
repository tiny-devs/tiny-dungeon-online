const Direction = {
    "Up": 1,
    "Down": 2,
    "Left": 3,
    "Right": 4
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
        this.pingEvent = ["ping", Uint8Array];
        this.playerName = '';
        this.playerList = [];
        this.players = [];
        this.confirmBtn.onclick = () => { this.onConfirmName() };
    }

    initWebSocket() {
        this.ws.onopen = () => this.successfulConection()
        this.ws.addEventListener('message', this.onReceiveMessage.bind(this))
    }

    successfulConection() {
        this.ws.send(JSON.stringify({command: 'player-login', name: this.playerName, color: this.getRandomColor()}));
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
            const receivedData = JSON.parse(data);
            
            switch (receivedData.command) {
                case 'player-login':
                    this.game.applyServerRules(receivedData);
                    this.initPlayers(receivedData.players);
                    break
                case 'player-move':
                    this.updatePlayer(receivedData);
                    break
            }

        } catch(e) {
            if(data != 'pong') {
                console.log(e)
            }
        }
    }

    initPlayers(players) {
        this.players.splice(0, this.players.length);
        this.players = players;
        this.drawEntities();
    }

    updatePlayer(data) {
        for(const player of this.players) {
            if (player.id == data.id) {
                player.x = data.x;
                player.y = data.y;
            }
        }
        this.drawEntities()
    }

    drawEntities(players) {
        while(this.playerListElement.firstChild ){
            this.playerListElement.removeChild(this.playerListElement.firstChild);
        }
    
        this.game.ctx.clearRect(0, 0, this.game.c.width, this.game.c.height);
        this.game.board.draw();
    
        this.players.forEach(player => {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(player.name));
            li.style.color = player.color;
            this.playerListElement.appendChild(li);
    
            this.game.ctx.beginPath();
            this.game.ctx.rect(player.x * this.game.cellWidth, player.y * this.game.cellHeight, this.game.cellWidth, this.game.cellHeight);
            this.game.ctx.fillStyle = player.color;
            this.game.ctx.fill();
            this.game.ctx.stroke();
        });
    }

    checkKey(e) {
        if (this.loggedIn) {
            if (e.keyCode == '38' || e.keyCode == '87') {
                var x = JSON.stringify({command: 'walk-command', name: this.playerName, key: Direction.Up })
                console.log(x);
                this.ws.send(x);
            } else if (e.keyCode == '40' || e.keyCode == '83') {
                this.ws.send(JSON.stringify({command: 'walk-command', name: this.playerName, key: Direction.Down }));
            } else if (e.keyCode == '37' || e.keyCode == '65') {
                this.ws.send(JSON.stringify({command: 'walk-command', name: this.playerName, key: Direction.Left }));
            } else if (e.keyCode == '39' || e.keyCode == '68') {
                this.ws.send(JSON.stringify({command: 'walk-command', name: this.playerName, key: Direction.Right }));
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
        this.ws.send(JSON.stringify({command: 'ping', name: this.pingEvent}));
        
        setTimeout(() => {
            this.pingPong();
        }, 10000)
    }
}