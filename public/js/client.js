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
        this.socket = io();
        this.playerName = '';
        this.playerList = [];
        this.confirmBtn.onclick = () => { this.onConfirmName() };
        this.moveCommand = {
            name: '',
            key: ''
        };

        this.socket.on('players', (players) => {

            while(this.playerListElement.firstChild ){
                this.playerListElement.removeChild(this.playerListElement.firstChild);
            }
        
            this.game.ctx.clearRect(0, 0, this.game.c.width, this.game.c.height);
            this.game.board.draw();
        
            players.forEach(player => {
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
        });
    }

    checkKey(e) {
        if (e.keyCode == '38' || e.keyCode == '87') {
            this.socket.emit('walk-command', { name: this.playerName, key: 'up' });
        } else if (e.keyCode == '40' || e.keyCode == '83') {
            this.socket.emit('walk-command', { name: this.playerName, key: 'down' });
        } else if (e.keyCode == '37' || e.keyCode == '65') {
            this.socket.emit('walk-command', { name: this.playerName, key: 'left' });
        } else if (e.keyCode == '39' || e.keyCode == '68') {
            this.socket.emit('walk-command', { name: this.playerName, key: 'right' });
        }
    }

    onConfirmName() {
        this.playerName = this.playerNameInput.value;
    
        if (this.playerName) {
            this.socket.emit('player-login', { name: this.playerName, color: this.getRandomColor()} );
            this.canvasElement.style.display="block";
            this.playerNameInput.style.display="none";
            this.confirmBtn.style.display="none";
            this.textDisplay.style.display="none";
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
}