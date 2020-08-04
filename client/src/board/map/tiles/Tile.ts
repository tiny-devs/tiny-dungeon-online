import { Game } from '../../../startup/Game.ts'

export class Tile {
    public id: number

    private game: Game | null
    private layer: any
    private x: number
    private y: number
    private tileMatrix: number[][]
    private tileSize: number

    constructor(game: Game, layer: any, x: number, y: number, tile: number[][]) {
        this.game = game
        this.layer = layer

        this.id = 0
        this.x = x
        this.y = y
        this.tileSize = 8
        this.tileMatrix = tile
    }

    draw() {
        this.layer.ctx.beginPath()

        for (let column = 0; column < this.tileSize; column++) {
            for (let line = 0; line < this.tileSize; line++) {
                const tileColor = this.tileMatrix[line][column]
                if (tileColor !== 0) {
                    this.layer.ctx.fillStyle = tileColor
                    const startX = ((column * this.game!.gridConfig.cellWidth) / this.tileSize + this.x * this.game!.gridConfig.cellWidth) | 0
                    const startY = ((line * this.game!.gridConfig.cellHeight) / this.tileSize + this.y * this.game!.gridConfig.cellHeight) | 0
                    const width = this.game!.gridConfig.cellWidth / this.tileSize
                    const height = this.game!.gridConfig.cellHeight / this.tileSize
                    this.layer.ctx.fillRect(startX, startY, width, height)
                }
            }
        }

        this.layer.ctx.fill()
    }

    clear() {
        this.layer.ctx.clearRect(this.x, this.y, this.game!.gridConfig.cellWidth, this.game!.gridConfig.cellHeight)
    }

    destroy() {
        this.clear()
        this.game = null
        this.layer = null
        this.id = 0
        this.x = 0
        this.y = 0
    }
}
