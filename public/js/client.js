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
        this.player = new Player(this);
        this.traps = [];
        this.board.draw();
        this.player.draw();
    }

    placeTrap() {
        if (this.player.power == this.player.maxPower) {
            this.player.power = 0;
            this.traps.push(new Trap(this));
            this.traps[this.traps.length - 1].draw();
        }
    }

    restart() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.board.draw();
        this.player.reset();
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

socket.on('walk-command', function(msg) {

    if (!playerList.includes(msg.playerName)) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(msg.playerName));
        playerListElement.appendChild(li);
        playerList.push(msg.playerName);
    }

    game.ctx.clearRect(0, 0, game.c.width, game.c.height);
    game.board.draw();
    game.traps.forEach((trap) => {
        trap.draw();
    });

    console.log(msg.key);
    switch (msg.key) {
        case 'right':
            game.player.moveRight();
            break;
        case 'down':
            game.player.moveDown();
            break;
        case 'left':
            game.player.moveLeft();
            break;
        case 'up':
            game.player.moveUp();
            break;
    }
    game.player.draw();
});