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
        this.npcs = [];
    }

    draw(clientRoomId) {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.drawPlayers(clientRoomId);
        this.drawNpcs(clientRoomId);
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

    addNpcs(npcs) {
        this.npcs.splice(0, this.npcs.length);
        for(const npc of npcs) {
            this.npcs.push(new Npc(this.game, this, npc.x, npc.y, this.getMatrixNpcById(npc.npcId), npc.id, npc.roomId, npc.hp));
        }
    }

    drawPlayers(clientRoomId) {
        while(this.playerListElement.firstChild){
            this.playerListElement.removeChild(this.playerListElement.firstChild);
        }

        this.players.forEach(player => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(player.name));
            li.style.color = player.color;
            this.playerListElement.appendChild(li);

            if (player.currentRoomId == clientRoomId) {
                player.draw();
            }
        });
    }

    drawNpcs(clientRoomId) {
        this.npcs.forEach(npc => {
            if (npc.roomId == clientRoomId) {
                npc.draw();
            }
        });
    }

    getPlayerById(id) {
        return this.players.find(x => x.id === id);
    }

    getNpcByIdAndRoom(id, roomId) {
        return this.npcs.find(x => (x.id === +id) && (x.roomId === +roomId));
    }

    getMatrixNpcById(npcId) {
        let npcMatrix = Npcs[Object.keys(Npcs)[npcId-1]];
        if (!npcMatrix) {
            console.log('No sprite defined')
        }
        
        return npcMatrix;
    }
}