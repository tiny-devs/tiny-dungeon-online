import { ItemsIds } from "../../models/Enums"
import Gear from "./Gear"
import GearCanvas from "./GearCanvas"

export default class GearItem {
    public itemId: number
    public item: any
    public gear: Gear
    public tileSize: number = 8
    public layer: GearCanvas

    constructor(gear: any, itemId: ItemsIds, item: any, itemCanvasId: string) {
        this.gear = gear
        this.itemId = itemId
        this.item = item
        this.layer = new GearCanvas(itemCanvasId)
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

    clear() {
        this.layer.ctx.clearRect(0, 0, this.layer.cellWidth, this.layer.cellHeight)
    }

    changeGear(itemId: ItemsIds, item: any) {
        this.clear()
        this.itemId = itemId
        this.item = item
    }

    destroy() {
        this.layer = null!
        this.itemId = null!
        this.draw = null!
    }
}