class Game {
    constructor(gameConfigs) {
        this.showGame = document.getElementById("game");
        this.c = document.getElementById("canvas");
        this.ctx = this.c.getContext("2d");
        this.width = gameConfigs.width;
        this.height = gameConfigs.height;
        this.boardRows = 5;
        this.boardColumns = 5;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        this.cellWidth = this.width / this.boardRows;
        this.cellHeight = this.height / this.boardColumns;

        this.board = new Board(this)
        this.players = [];
        this.board.draw();

        this.client = new Client(this);
    }

    applyServerRules(serverData) {
        this.boardRows = serverData.boardRows;
        this.boardColumns = serverData.boardColumns;
        this.cellWidth = this.width / this.boardRows;
        this.cellHeight = this.height / this.boardColumns;
    }

    addPlayers(players) {
        this.players.splice(0, this.players.length);
        for(const player of players) {
            this.players.push(new Player(this, player));
        }
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
    constructor(game, playerData) {
        this.game = game;

        this.x = playerData.x;
        this.y = playerData.y;
        this.color = playerData.color;
        this.name = playerData.name;
        this.id = playerData.id;
        this.playerSize = 8;
        this.playerMatrix = this.definePlayerShape();
    }

    definePlayerShape() {
        return [
            [ 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 1, 0, 0, 0],
            [ 0, 0, 0, 1, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 1, 1, 0, 0],
            [ 0, 1, 0, 1, 1, 0, 1, 0],
            [ 0, 0, 0, 1, 1, 0, 0, 0],
            [ 0, 0, 1, 0, 0, 1, 0, 0],
            [ 0, 0, 1, 0, 0, 1, 0, 0]
        ];
    }

    draw() {
        this.game.ctx.beginPath();

        for (let column = 0; column < this.playerSize; column++) {
            for (let line = 0; line < this.playerSize; line++) {
                const draw = this.playerMatrix[line][column];
                if (draw) {
                    this.game.ctx.fillStyle = this.color;
                    const startX = (column * this.game.cellWidth / this.playerSize) + (this.x * this.game.cellWidth);
                    const startY = (line * this.game.cellHeight / this.playerSize) + (this.y * this.game.cellHeight);
                    this.game.ctx.fillRect(startX, startY, this.game.cellWidth / this.playerSize, this.game.cellHeight / this.playerSize);
                } 
            }
        }

        this.game.ctx.stroke();
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}

let gameConfigs = {
    width: 500,
    height: 500,
};

const game = new Game(gameConfigs);