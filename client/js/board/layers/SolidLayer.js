class SolidLayer {
    constructor(game) {
        this.game = game;

        this.c = document.getElementById('solid-layer');
        this.ctx = this.c.getContext('2d');
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = null;
        this.ctx.canvas.width = this.game.width;
        this.ctx.canvas.height = this.game.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }
}