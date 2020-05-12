var socket = io();

var textDisplay = document.getElementById("text-display");
var playerNameInput = document.getElementById("player-name");
var confirmBtn = document.getElementById("confirm-btn")
var canvasElement = document.getElementById("canvas");
var playerListElement = document.getElementById("player-list");
var playerList = [];

canvasElement.style.display="none";
confirmBtn.onclick = function() { onConfirmName() };

var moveCommand = {
    name: "",
    key: ""
};
var playerName = "";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  
function checkKey(e) {

    if (e.keyCode == '38') {
        socket.emit('walk-command', { name: playerName, key: 'up' });
    } else if (e.keyCode == '40') {
        socket.emit('walk-command', { name: playerName, key: 'down' });
    } else if (e.keyCode == '37') {
        socket.emit('walk-command', { name: playerName, key: 'left' });
    } else if (e.keyCode == '39') {
        socket.emit('walk-command', { name: playerName, key: 'right' });
    }
}

document.onkeydown = checkKey;

class Game {
    constructor(gameConfigs) {
        this.showGame = document.getElementById("game");
        this.c = document.getElementById("canvas");
        this.ctx = this.c.getContext("2d");
        this.width = gameConfigs.width;
        this.height = gameConfigs.height;
        this.boardRows = gameConfigs.boardRows;
        this.boardColumns = gameConfigs.boardColumns;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.cellWidth = this.width / this.boardRows;
        this.cellHeight = this.height / this.boardColumns;

        this.board = new Board(this)
        this.players = [];
        this.board.draw();
    }

    restart() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.board.draw();
        this.player1.reset();
        this.player2.reset();
        this.traps.splice(0, this.traps.length);

        this.showGame.style.display = "block";
        this.showGameOver.style.display = "none";
        this.showGameWin.style.display = "none";
    }
}

class Board {
    constructor(game) {
        this.game = game;
    }

    draw() {
        let i = 0;
        let j = 0;
        for (i = 0; i < this.game.boardRows; i++) {
            for (j = 0; j < this.game.boardColumns; j++) {
                this.game.ctx.beginPath();
                this.game.ctx.rect(i * this.game.cellWidth, j * this.game.cellHeight, this.game.cellWidth, this.game.cellHeight);
                this.game.ctx.stroke();
            }
        }
    }
}

let gameConfigs = {
    width: 300,
    height: 300,
    boardRows: 7,
    boardColumns: 7
};

const game = new Game(gameConfigs);

socket.on('players', function(players) {

    while(playerListElement.firstChild ){
        playerListElement.removeChild(playerListElement.firstChild);
    }

    game.ctx.clearRect(0, 0, game.c.width, game.c.height);
    game.board.draw();

    players.forEach(player => {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(player.name));
        li.style.color = player.color;
        playerListElement.appendChild(li);

        game.ctx.beginPath();
        game.ctx.rect(player.x * game.cellWidth, player.y * game.cellHeight, game.cellWidth, game.cellHeight);
        game.ctx.fillStyle = player.color;
        game.ctx.fill();
        game.ctx.stroke();
    });
});

function onConfirmName() {
    playerName = playerNameInput.value;

    if (playerName) {
        socket.emit('player-login', { name: playerName, color: getRandomColor()} );
        canvasElement.style.display="block";
        playerNameInput.style.display="none";
        confirmBtn.style.display="none";
        textDisplay.style.display="none";
    }
}