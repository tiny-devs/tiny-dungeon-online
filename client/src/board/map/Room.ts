import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { SolidTiles } from './tiles/Tiles'
import { Tile } from './tiles/Tile'
import { Color } from './tiles/Color'

export class Room {
    public id: Rooms
    public backgroundLayerShape: Color[][][][]
    public solidLayerShape: (number | (number | Color)[][])[][]

    private game: Game
    private tiles: Tile[]

    constructor(game: Game, id: Rooms, backgroundLayer: Color[][][][], solidLayer: (number | (number | Color)[][])[][]) {
        this.game = game
        this.id = id

        this.backgroundLayerShape = backgroundLayer
        this.solidLayerShape = solidLayer
        this.tiles = []

        this.initTiles()
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
                    const tiles = SolidTiles as any
                    const tile = tiles[Object.keys(SolidTiles)[tileToDraw-1]]

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
