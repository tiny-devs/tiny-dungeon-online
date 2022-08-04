import { Color } from "../../board/map/tiles/Color"
import { ItemsIds } from '../../../../shared/Enums'
import ItemCanvas from "./ItemCanvas"
import Store from "./Store"

export default class StoreItem {
    public itemId: number
    public itemPrice: number
    public store: Store
    public item: any
    public tileSize: number = 8
    public layer: ItemCanvas

    constructor(bag: any, itemId: ItemsIds, item: any, itemCanvasId: string, itemPrice: number) {
        this.store = bag
        this.itemId = itemId
        this.itemPrice = itemPrice
        this.item = item
        this.layer = new ItemCanvas(itemCanvasId)
    }

    draw(isPlayerBuying: boolean) {
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

        let priceTag = document.createElement('div')
        priceTag.innerHTML = `${this.itemPrice}`
        priceTag.style.textAlign = 'center'
        priceTag.style.maxWidth = '32px'
        priceTag.style.marginBottom = '5px'
        if (isPlayerBuying) {
            priceTag.style.color = Color.Red
        } else {
            priceTag.style.color = Color.Green
        }
        
        this.layer.c.parentNode!.appendChild(priceTag)
    }

    destroy() {
        this.layer = null!
        this.itemId = null!
        this.draw = null!
    }
}