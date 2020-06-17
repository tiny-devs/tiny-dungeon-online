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
        this.layer.ctx.fillStyle = this.color;

        for (let column = 0; column < this.playerSize; column++) {
            for (let line = 0; line < this.playerSize; line++) {
                const draw = this.playerMatrix[line][column];
                if (draw) {
                    const startX = ((column * this.game.cellWidth / this.playerSize) + (this.x * this.game.cellWidth)) | 0;
                    const startY = ((line * this.game.cellHeight / this.playerSize) + (this.y * this.game.cellHeight)) | 0;
                    const width = (this.game.cellWidth / this.playerSize);
                    const height = (this.game.cellHeight / this.playerSize);
                    this.layer.ctx.fillRect(startX, startY, width, height);
                } 
            }
        }

        this.layer.ctx.fill();
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    isValidMove(direction, collisionShape) {
        let valid = true;
        switch(direction){
            case Direction.Up:
                if (collisionShape[+this.y-1][+this.x]) {
                    valid = false;
                }
                break;
            case Direction.Down:
                if (collisionShape[+this.y+1][+this.x]) {
                    valid = false;
                }
                break;
            case Direction.Left:
                if (collisionShape[+this.y][+this.x-1]) {
                    valid = false;
                }
                break;
            case Direction.Right:
                if (collisionShape[+this.y][+this.x+1]) {
                    valid = false;
                }
                break;
        }

        return valid;
    }
}