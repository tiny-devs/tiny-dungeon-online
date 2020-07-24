class Npc {
  constructor(game, layer, x, y, npc, id, roomId, hp, maxHp) {
    this.game = game;
    this.layer = layer;

    this.id = id;
    this.roomId = roomId;
    this.x = x;
    this.y = y;
    this.tileSize = 8;
    this.tileMatrix = npc;
    this.maxHp = maxHp;
    this.hp = hp;
    this.pveData;
    this.isFighting = false;
  }

  draw() {
    this.layer.ctx.beginPath();

    for (let column = 0; column < this.tileSize; column++) {
      for (let line = 0; line < this.tileSize; line++) {
        const tileColor = this.tileMatrix[line][column];
        if (tileColor !== 0) {
            this.layer.ctx.fillStyle = tileColor
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

  takeDamage(pveData) {
    this.pveData = pveData;
    this.hp = pveData.npcHp;
    this.isFighting = true;
    this.drawHp();
    if (this.hp <= 0) {
      this.hp = this.maxHp;
      this.isFighting = false;
    }

    if (pveData.playerHp <= 1) {
      this.isFighting = false;
    }
  }

  drawHp() {
    this.layer.ctx.beginPath();
    this.layer.ctx.fillStyle = Color.Red;
    this.layer.ctx.fillRect(this.x * this.game.cellWidth, this.y * (this.game.cellHeight - 2), this.game.cellWidth, 5);
    this.layer.ctx.fillStyle = Color.DarkGreen;
    this.layer.ctx.fillRect(this.x * this.game.cellWidth, this.y * (this.game.cellHeight - 2), (this.game.cellWidth * this.hp)/this.maxHp, 5);
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

  move(moveData) {
    if ((moveData.x != this.x) || (moveData.y != this.y)) {
      this.isFighting = false;
    }

    this.x = moveData.x;
    this.y = moveData.y;
  }

  clear() {
    this.layer.ctx.clearRect(this.x, this.y, this.game.cellWidth, this.game.cellHeight);
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