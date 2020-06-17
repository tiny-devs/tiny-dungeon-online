class Dirt {
  constructor(game, layer, x, y) {
    this.game = game;
    this.layer = layer;

    this.id = 1;
    this.x = x * this.game.cellWidth;
    this.y = y * this.game.cellHeight;
    this.color = '#917450';

    this.draw();
  }

  draw() {
    this.layer.ctx.beginPath();
    this.layer.ctx.fillStyle = this.color;
    this.layer.ctx.fillRect(this.x, this.y, this.game.cellWidth, this.game.cellHeight);
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