import { ItemsIds } from '../../../../shared/Enums'
import Bank from "./Bank"
import ItemCanvas from "./ItemCanvas"

export default class BankItem {
    public itemId: number
    public bank: Bank
    public item: any
    public tileSize: number = 8
    public layer: ItemCanvas

    constructor(bank: Bank, itemId: ItemsIds, item: any, itemCanvasId: string) {
        this.bank = bank
        this.itemId = itemId
        this.item = item
        this.layer = new ItemCanvas(itemCanvasId)
    }

    draw() {
        this.layer.ctx.beginPath();

        for (let column = 0; column < this.tileSize; column++) {
            for (let line = 0; line < this.tileSize; line++) {
                const tileColor = this.item[line][column]
                if (tileColor !== 0) {
                    this.layer.ctx.fillStyle = tileColor
                    const startX = (column * this.layer.cellWidth / this.tileSize) | 0
                    const startY = (line * this.layer.cellHeight / this.tileSize) | 0
                    const width = (this.layer.cellWidth / this.tileSize)
                    const height = (this.layer.cellHeight / this.tileSize)
                    this.layer.ctx.fillRect(startX, startY, width, height)
                }
            }
        }

        this.layer.ctx.fill()
    }

    destroy() {
        this.layer = null!
        this.itemId = null!
        this.draw = null!
    }
}
