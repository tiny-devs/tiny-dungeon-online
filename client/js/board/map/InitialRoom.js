class InitialRoom {
  constructor(game) {
    this.game = game;

    this.id = 0;
    this.backgroundLayerShape = this.getBackgroundLayerShape();
    this.solidLayerShape = this.getSolidLayerShape();
    this.tiles = [];
  }

  getBackgroundLayerShape() {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
  }

  getSolidLayerShape() {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],];
  }

  draw() {
    for (let column = 0; column < this.game.boardColumns; column++) {
      for (let line = 0; line < this.game.boardRows; line++) {

        switch(this.backgroundLayerShape[line][column]){
          case 0:
            this.tiles.push(new Grass(this.game, this.game.backgroundLayer, column, line));
            break;
          case 1:
            this.tiles.push(new Dirt(this.game, this.game.backgroundLayer, column, line));
            break;
        }

        switch(this.solidLayerShape[line][column]){
          case 1:
            this.tiles.push(new Tree(this.game, this.game.solidLayer, column, line));
            break;
        }
        
      }
    }
  }

  clear() {
    this.tiles.forEach((tile) => {
      tile.destroy();
    });

    this.tiles.splice(0, this.tiles.length);
  }
}