import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Tiles } from './tiles/Tiles'
import { Tile } from './tiles/Tile'
import { Color } from './tiles/Color'
import { SolidLayers } from '../../../../shared/solidLayers'

export class InitialRoom {
    public id: Rooms
    public backgroundLayerShape: Color[][][][]
    public solidLayerShape: (number | (number | Color)[][])[][]

    private game: Game
    private tiles: Tile[]

    constructor(game: Game, id: Rooms) {
        this.game = game

        this.id = id
        this.backgroundLayerShape = this.getBackgroundLayerShape()
        this.solidLayerShape = this.getSolidLayerShape()
        this.tiles = []

        this.initTiles()
    }

    getBackgroundLayerShape() {
        return [
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Dirt, Tiles.Dirt],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Rocks, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Bush, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.Grass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.Bush, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
            [Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass, Tiles.FlatGrass],
        ]
    }

    getSolidLayerShape() {
        return SolidLayers.InitialRoom
    }

    initTiles() {
        for (let column = 0; column < this.game.gridConfig.columns; column++) {
            for (let line = 0; line < this.game.gridConfig.rows; line++) {
                const tileToDrawBackground = this.backgroundLayerShape[line][column] as any
                if (tileToDrawBackground != 0) {
                    this.tiles.push(new Tile(this.game, this.game.backgroundLayer, column, line, tileToDrawBackground))
                }

                const tileToDraw = this.solidLayerShape[line][column] as number
                if (tileToDraw != 0) {
                    const tiles = Tiles as any
                    const tile = tiles[Object.keys(Tiles)[tileToDraw-1]]

                    this.tiles.push(new Tile(this.game, this.game.solidLayer, column, line, tile))
                }
            }
        }
    }

    draw() {
        for (const tile of this.tiles) {
            tile.draw()
        }
    }

    clear() {
        this.game.backgroundLayer.clear()
        this.game.solidLayer.clear()
    }
}
