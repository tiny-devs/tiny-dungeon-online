class Player {
    constructor(game, playerData, layer) {
        this.game = game;
        this.layer = layer;

        this.x = playerData.x;
        this.y = playerData.y;
        this.color = playerData.color;
        this.name = playerData.name;
        this.id = playerData.id;
        this.currentRoomId = playerData.currentRoomId;
        this.hp = playerData.hp;
        this.maxHp = playerData.maxHp;
        this.isFighting = false;
        this.pveData;
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

    takeDamage(pveData) {
        this.pveData = pveData;
        this.hp = pveData.playerHp;
        this.isFighting = true;
        this.drawHp();
        if (this.hp <= 0) {
            this.hp = this.maxHp
            this.isFighting = false;
        }

        if (pveData.npcHp <= 1) {
            this.isFighting = false;
        }
    }

    drawHp() {
        this.layer.ctx.beginPath();
        this.layer.ctx.fillStyle = Color.Red;
        this.layer.ctx.fillRect(this.x * this.game.cellWidth, (this.y) * (this.game.cellHeight - 2), this.game.cellWidth, 5);
        this.layer.ctx.fillStyle = Color.DarkGreen;
        this.layer.ctx.fillRect(this.x * this.game.cellWidth, (this.y) * (this.game.cellHeight - 2), (this.game.cellWidth * this.hp)/this.maxHp, 5);
        this.layer.ctx.fill();

        this.drawHit();
    }

    drawHit() {
        let dmgFactor = ''
        this.layer.ctx.font = "15px arial";
        if (this.pveData.damageCaused == 0) {
            this.layer.ctx.fillStyle = Color.Blue;
        } else {
            this.layer.ctx.fillStyle = Color.Red;
            dmgFactor = '-'
        }

        this.layer.ctx.fillText(`${dmgFactor}${this.pveData.damageCaused}`,
        (this.x * this.game.cellWidth) + (this.game.cellWidth/2), this.y * (this.game.cellHeight - 3));
    }

    move(x, y, currentRoomId) {
        if ((x != this.x) || (y != this.y)) {
            this.isFighting = false;
        }

        this.x = x;
        this.y = y;
        this.currentRoomId = currentRoomId;
    }

    isValidMove(direction, collisionShape) {
        let valid = true;
        switch(direction){
            case Direction.Up:
                if (!this.isOnBorder(collisionShape, +this.x, +this.y-1)) {
                    if (collisionShape[+this.y-1][+this.x]) {
                        valid = false;
                    }
                }
                break;
            case Direction.Down:
                if (!this.isOnBorder(collisionShape, +this.x, +this.y+1)) {
                    if (collisionShape[+this.y+1][+this.x]) {
                        valid = false;
                    }
                }
                break;
            case Direction.Left:
                if (!this.isOnBorder(collisionShape, +this.x-1, +this.y)) {
                    if (collisionShape[+this.y][+this.x-1]) {
                        valid = false;
                    }
                }
                break;
            case Direction.Right:
                if (!this.isOnBorder(collisionShape, +this.x+1, +this.y)) {
                    if (collisionShape[+this.y][+this.x+1]) {
                        valid = false;
                    }
                }
                break;
        }
        
        return valid;
    }

    isOnBorder(collisionShape, x, y) {
        let onBorder = false;
        if (collisionShape[y] !== undefined) {
            if (collisionShape[y][x] === undefined) {
                onBorder = true;
            }
        } else {
            onBorder = true;
        }
        return onBorder;
    }
}