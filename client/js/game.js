class Game {
    constructor(gameConfigs, mainElements) {
        this.width = gameConfigs.width;
        this.height = gameConfigs.height;
        this.boardRows = 5;
        this.boardColumns = 5;
        this.cellWidth = this.width / this.boardRows;
        this.cellHeight = this.height / this.boardColumns;

        this.backgroundLayer = new BackgroundLayer(this);
        this.spritesLayer = new SpritesLayer(this);

        this.board = new Board(this, this.backgroundLayer);
        this.players = [];
    }

    applyServerRules(serverData) {
        this.boardRows = serverData[2];
        this.boardColumns = serverData[3];
        this.cellWidth = this.width / this.boardRows;
        this.cellHeight = this.height / this.boardColumns;

        this.board.draw();
    }

    addPlayers(players) {
        this.players.splice(0, this.players.length);
        for(const player of players) {
            this.players.push(new Player(this, player, this.spritesLayer));
        }
    }
}

class Board {
    constructor(game, layer) {
        this.game = game;
        this.layer = layer;
    }

    draw() {
        this.layer.clear();

        let i = 0;
        let j = 0;
        for (i = 0; i < this.game.boardRows; i++) {
            for (j = 0; j < this.game.boardColumns; j++) {
                this.layer.ctx.beginPath();
                this.layer.ctx.rect(i * this.game.cellWidth, j * this.game.cellHeight, this.game.cellWidth, this.game.cellHeight);
                this.layer.ctx.stroke();
            }
        }
    }
}

class Player {
    constructor(game, playerData, layer) {
        this.game = game;
        this.layer = layer;

        this.x = playerData.x;
        this.y = playerData.y;
        this.color = playerData.color;
        this.name = playerData.name;
        this.id = playerData.id;
        this.playerSize = 8;
        this.playerMatrix = playerData.matrix.map((arr) => {
            return arr.slice();
        });
    }

    draw() {
        this.layer.ctx.beginPath();

        for (let column = 0; column < this.playerSize; column++) {
            for (let line = 0; line < this.playerSize; line++) {
                const draw = this.playerMatrix[line][column];
                if (draw) {
                    this.layer.ctx.fillStyle = this.color;
                    const startX = (column * this.game.cellWidth / this.playerSize) + (this.x * this.game.cellWidth);
                    const startY = (line * this.game.cellHeight / this.playerSize) + (this.y * this.game.cellHeight);
                    this.layer.ctx.fillRect(startX, startY, this.game.cellWidth / this.playerSize, this.game.cellHeight / this.playerSize);
                } 
            }
        }

        this.layer.ctx.stroke();
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}

class SpritesLayer {
    constructor(game) {
        this.game = game;

        this.c = document.getElementById('sprites-layer');
        this.ctx = this.c.getContext('2d');
        this.ctx.canvas.width = this.game.width;
        this.ctx.canvas.height = this.game.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }
}

class BackgroundLayer {
    constructor(game) {
        this.game = game;

        this.c = document.getElementById('background-layer');
        this.ctx = this.c.getContext('2d');
        this.ctx.canvas.width = this.game.width;
        this.ctx.canvas.height = this.game.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }
}