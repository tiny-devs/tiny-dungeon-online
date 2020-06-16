class SpritesLayer {
    constructor(game) {
        this.game = game;

        this.playerListElement = document.getElementById('player-list');
        this.c = document.getElementById('sprites-layer');
        this.ctx = this.c.getContext('2d');
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = null;
        this.ctx.canvas.width = this.game.width;
        this.ctx.canvas.height = this.game.height;

        this.players = [];
        // next we will have: this.enemies, this.warps, this.trees, etc...
    }

    draw() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.drawPlayers();
        // this.drawEnemies, this.drawWarps, ...
    }

    clear() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }

    addPlayers(players) {
        this.players.splice(0, this.players.length);
        for(const player of players) {
            this.players.push(new Player(this.game, player, this));
        }
    }

    drawPlayers() {
        while(this.playerListElement.firstChild){
            this.playerListElement.removeChild(this.playerListElement.firstChild);
        }

        this.players.forEach(player => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(player.name));
            li.style.color = player.color;
            this.playerListElement.appendChild(li);

            player.draw();
        });
    }
}