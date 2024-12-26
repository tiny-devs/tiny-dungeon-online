import { Game } from '../../startup/Game'
import { Direction, Rooms } from '../../../../shared/Enums'
import { SolidTiles } from './tiles/Tiles'
import { Tile } from './tiles/Tile'
import { Color } from './tiles/Color'

export class Room {
    public id: Rooms
    public backgroundLayerShape: Color[][][][]
    public solidLayerShape: (number | (number | Color)[][])[][]
    public tiles: Tile[]

    private game: Game

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
            const columnTiles = []

            for (let line = 0; line < this.game.gridConfig.rows; line++) {
                let backTile: Tile | null = null
                let solidTile: Tile | null = null

                const tileToDrawBackground = this.backgroundLayerShape[line][column] as any
                if (tileToDrawBackground != 0) {
                    backTile = new Tile(this.game, this.game.backgroundLayer, column, line, tileToDrawBackground)
                    this.tiles.push(backTile)
                }

                const tileToDraw = this.solidLayerShape[line][column] as number
                if (tileToDraw != 0 && tileToDraw != -1) {
                    const tiles = SolidTiles as any
                    const tile = tiles[Object.keys(SolidTiles)[tileToDraw-1]]

                    solidTile = new Tile(this.game, this.game.solidLayer, column, line, tile)
                    this.tiles.push(solidTile)
                }

                if (backTile != null) {
                    columnTiles.push(backTile)
                }
                if (solidTile != null) {
                    columnTiles.push(solidTile)
                }
                
            }
        }
    }

    async draw(lastRoom: Room | undefined = undefined, direction: Direction = 0, isMobile = false) {
        if (lastRoom && direction != Direction.None) {
            let xModifier = -1
            let yModifier = 0
            let animationSize = 2.0

            if (direction == Direction.Left) {
                yModifier = 0
                xModifier = 1
            }
            if (direction == Direction.Up) {
                yModifier = -1
                xModifier = 0
            }
            if (direction == Direction.Down) {
                yModifier = 1
                xModifier = 0
            }
            if (isMobile) {
                animationSize = 1.0
            }
            let lastRoomAxisPosition = 0
            let currentRoomAxisPosition = this.game.gridConfig.columns
            const sleepTime = 32/animationSize
            const axisStep = 1.0/animationSize
            for (let axisPosition = this.game.gridConfig.columns * animationSize; axisPosition >= 0; axisPosition--) {

                for (let i = 0; i < this.tiles.length; i++) {
                    this.tiles[i].draw(xModifier * currentRoomAxisPosition, yModifier * currentRoomAxisPosition)
                    
                    if (lastRoom.tiles[i]) {
                        lastRoom.tiles[i].draw(xModifier * lastRoomAxisPosition, yModifier * lastRoomAxisPosition)
                    }
                }

                await this.sleep(sleepTime)
                if (axisPosition != 0) {
                    this.game.solidLayer.clear()
                }
                lastRoomAxisPosition = lastRoomAxisPosition - axisStep
                currentRoomAxisPosition = currentRoomAxisPosition - axisStep
            }
        }
        else {
            this.clear()
            for (const tile of this.tiles) {
                tile.draw()
            }
        }
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clear() {
        this.game.backgroundLayer.clear()
        this.game.solidLayer.clear()
    }
}
