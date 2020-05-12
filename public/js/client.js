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
    playerName: "",
    key: ""
};

function onConfirmName() {
    var playerName = playerNameInput.value;

    if (playerName) {
        console.log(playerName);
        moveCommand.playerName = playerName;
        canvasElement.style.display="block";
        playerNameInput.style.display="none";
        confirmBtn.style.display="none";
        textDisplay.style.display="none";
    }
}

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
        moveCommand.key = 'up';
        socket.emit('walk-command', moveCommand);
    } else if (e.keyCode == '40') {
        moveCommand.key = 'down';
        socket.emit('walk-command', moveCommand);
    } else if (e.keyCode == '37') {
        moveCommand.key = 'left';
        socket.emit('walk-command', moveCommand);
    } else if (e.keyCode == '39') {
        moveCommand.key = 'right';
        socket.emit('walk-command', moveCommand);
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
        this.player1 = new Player(this);
        this.player2 = new Player(this);
        this.traps = [];
        this.board.draw();
        this.player1.draw();
        this.player2.draw();
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

class Player {
    constructor(game) {
        this.game = game;

        this.x = 0;
        this.y = 0;
        this.health = 100;
        this.power = 0;
        this.maxPower = 3;
        this.color = getRandomColor();
    }

    draw() {
        if ((this.x >= 0 && this.x < this.game.boardRows) && (this.y >= 0 && this.y < this.game.boardColumns)) {
            this.game.ctx.beginPath();
            this.game.ctx.rect(this.x * this.game.cellWidth, this.y * this.game.cellHeight, this.game.cellWidth, this.game.cellHeight);
            this.game.ctx.fillStyle = this.color;
            this.game.ctx.fill();
            this.game.ctx.stroke();
        }
    }

    moveUp() {
        if (this.y - 1 >= 0) {
            this.y -= 1;
            this.addPower();
            this.checkTrapsCollision();
        }
        this.draw();
    }

    moveDown() {
        if (this.y + 1 < this.game.boardColumns) {
            this.y += 1;
            this.addPower();
            this.checkTrapsCollision();
        }
        this.draw();
    }

    moveLeft() {
        if (this.x - 1 >= 0) {
            this.x -= 1;
            this.addPower();
            this.checkTrapsCollision();
        }
        this.draw();
    }

    moveRight() {
        if (this.x + 1 < this.game.boardRows) {
            this.x += 1;
            this.addPower();
            this.checkTrapsCollision();
        }
        this.draw();
    }

    addPower() {
        if (this.power + 1 <= this.maxPower) {
            this.power += 1;
        }
    }

    checkTrapsCollision() {
        this.game.traps.forEach((trap) => {
            if ((this.x == trap.x) && (this.y == trap.y)) {
                this.health -= trap.damage;
            }
        });
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.health = 100;
        this.power = 0;
        this.draw();
    }
}

class Trap {
    constructor(game) {
        this.game = game;

        this.x = this.game.player.x;
        this.y = this.game.player.y;
        this.damage = 10;
    }

    draw() {
        this.game.ctx.beginPath();
        this.game.ctx.rect(this.x * this.game.cellWidth, this.y * this.game.cellHeight, this.game.cellWidth, this.game.cellHeight);
        this.game.ctx.fillStyle = "purple";
        this.game.ctx.fill();
        this.game.ctx.stroke();
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
    game.traps.forEach((trap) => {
        trap.draw();
    });

    players.forEach(player => {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(player.name));
        playerListElement.appendChild(li);
    });

    game.player1.x = players[0].x;
    game.player1.y = players[0].y;
    game.player2.x = players[1].x;
    game.player2.y = players[1].y;

    game.player1.draw();
    game.player2.draw();
});