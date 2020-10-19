import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { ItemsIds } from '../../models/Enums'

export class Item {
    public id: number
    public itemId: ItemsIds
    public roomId: Rooms
    public x: number
    public y: number
    public itemMatrix: any[]
    private game: Game
    private layer: any
    private tileSize: number

    constructor(game: Game, layer: any, itemData: Partial<Item>, itemMatrix: any[]) {
        this.game = game
        this.layer = layer

        this.id = itemData.id!
        this.itemId = itemData.itemId!
        this.roomId = itemData.roomId!
        this.x = itemData.x!
        this.y = itemData.y!
        this.tileSize = 8
        this.itemMatrix = [...itemMatrix]
    }

    draw() {
        this.layer.ctx.beginPath()

        for (let column = 0; column < this.tileSize; column++) {
            for (let line = 0; line < this.tileSize; line++) {
                const tileColor = this.itemMatrix[line][column]
                if (tileColor !== 0) {
                    this.layer.ctx.fillStyle = tileColor
                    const startX = ((column * this.game.gridConfig.cellWidth) / this.tileSize + this.x * this.game.gridConfig.cellWidth) | 0
                    const startY = ((line * this.game.gridConfig.cellHeight) / this.tileSize + this.y * this.game.gridConfig.cellHeight) | 0
                    const width = this.game.gridConfig.cellWidth / this.tileSize
                    const height = this.game.gridConfig.cellHeight / this.tileSize
                    this.layer.ctx.fillRect(startX, startY, width, height)
                }
            }
        }

        this.layer.ctx.fill()
    }

    clear() {
        this.layer.ctx.clearRect(this.x * this.game.gridConfig.cellWidth, this.y * this.game.gridConfig.cellHeight, this.game.gridConfig.cellWidth, this.game.gridConfig.cellHeight)
    }

    destroy() {
        this.clear()
        this.layer = null
        this.id = 0
        this.x = 0
        this.y = 0
    }
}
