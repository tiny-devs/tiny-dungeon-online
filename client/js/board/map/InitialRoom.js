class InitialRoom {
  constructor(game) {
    this.game = game;

    this.id = 0;
    this.backgroundLayerShape = this.getBackgroundLayerShape();
    this.solidLayerShape = this.getSolidLayerShape();
    this.tiles = [];
  }

  getBackgroundLayerShape() {
    return [[Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.Bush,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Bush,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Bush,Tiles.Rocks,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.Grass    ,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Bush,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Dirt,Tiles.Dirt],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Rocks,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Rocks,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Bush,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Bush,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.Grass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.Bush,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass],
            [Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass,Tiles.FlatGrass]];
  }

  getSolidLayerShape() {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,Tiles.Tree,0,Tiles.Tree],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,Tiles.SmallTree,Tiles.Tree,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,Tiles.Tree,0,0,0,0,0,0,0,Tiles.SmallTree,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,Tiles.SmallTree,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,Tiles.Tree,0,0,0,0,Tiles.Tree,0,0,Tiles.SmallTree],
            [0,0,Tiles.Tree,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,Tiles.SmallTree,0,0,0,0,Tiles.Tree,0,0,Tiles.SmallTree,0],
            [Tiles.Tree,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [Tiles.SmallTree,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [Tiles.Tree,Tiles.Tree,0,0,0,0,0,0,0,0,0,0,0,0,0,Tiles.Tree]];
  }

  draw() {
    for (let column = 0; column < this.game.boardColumns; column++) {
      for (let line = 0; line < this.game.boardRows; line++) {

        const tileToDrawBackground = this.backgroundLayerShape[line][column];
        if (tileToDrawBackground != 0) {
          this.tiles.push(new Tile(this.game, this.game.backgroundLayer, column, line, tileToDrawBackground));
        }

        const tileToDraw = this.solidLayerShape[line][column];
        if (tileToDraw != 0) {
          this.tiles.push(new Tile(this.game, this.game.solidLayer, column, line, tileToDraw));
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