class Board {
    constructor(game, layer) {
        this.game = game;
        this.layer = layer;
    }

    draw() {
        this.layer.clear();
        this.layer.ctx.beginPath();
        this.layer.ctx.rect(0, 0, this.game.width, this.game.height);
        this.layer.ctx.stroke();
    }
}