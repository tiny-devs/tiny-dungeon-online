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

        this.client = new Client(this);
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
    width: 500,
    height: 500,
    boardRows: 7,
    boardColumns: 7
};

const game = new Game(gameConfigs);