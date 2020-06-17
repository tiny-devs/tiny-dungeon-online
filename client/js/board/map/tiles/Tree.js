class Tree {
  constructor(game, layer, x, y) {
    this.game = game;
    this.layer = layer;

    this.id = 0;
    this.x = x;
    this.y = y;
    this.tileSize = 8;
    this.leavesColor = '#1a962c';
    this.woodColor = '#75593b';
    this.tileMatrix = this.getShape();

    this.draw();
  }

  getShape() {
    return [[1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,0,0,2,2,0,0,0],
            [0,0,0,2,2,0,0,0],
            [0,0,0,2,2,0,0,0],];
  }

  draw() {
    this.layer.ctx.beginPath();

    for (let column = 0; column < this.tileSize; column++) {
      for (let line = 0; line < this.tileSize; line++) {
        const draw = this.tileMatrix[line][column];
        if (draw !== 0) {
            if (draw === 1) {
              this.layer.ctx.fillStyle = this.leavesColor;
            } else {
              this.layer.ctx.fillStyle = this.woodColor;
            }
            const startX = ((column * this.game.cellWidth / this.tileSize) + (this.x * this.game.cellWidth)) | 0;
            const startY = ((line * this.game.cellHeight / this.tileSize) + (this.y * this.game.cellHeight)) | 0;
            const width = (this.game.cellWidth / this.tileSize);
            const height = (this.game.cellHeight / this.tileSize);
            this.layer.ctx.fillRect(startX, startY, width, height);
        } 
      }
    }

    this.layer.ctx.fill();
  }

  clear() {
    this.ctx.clearRect(this.x, this.y, this.game.cellWidth, this.game.cellHeight);
  }

  destroy() {
    this.clear();
    this.game = null;
    this.layer = null;
    this.id = null;
    this.x = null;
    this.y = null;
    this.color = null;
    this.draw = null;
    this.clear = null;
  }
}