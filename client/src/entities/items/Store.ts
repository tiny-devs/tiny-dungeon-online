import { ItemsIds } from "../../models/Enums"
import StoreItem from "./StoreItem"
import { Items } from "./Items"
import { GameClient } from "../../startup/GameClient"

export default class Store {
    public items: any[] = []
    public size: number = 24
    public merchantId: number = 0
    public itemsHolderEl: HTMLElement
    private client: GameClient
    private itemsCount: number = 0

    constructor(client: GameClient) {
        this.itemsHolderEl = document.getElementById('store-items')!
        this.client = client
    }

    public drawItems() {
        for (const item of this.items) {
            item.draw()
        }
    }

    public addItem(itemId: ItemsIds, itemPrice: number) {
        if (this.items.length < this.size) {
            this.itemsCount++
            const itemSprite = this.getItemSprite(itemId)
            const canvasId = this.addCanvasNode(itemId, itemPrice)
            this.items.push(new StoreItem(this,itemId,itemSprite,canvasId, itemPrice))
        }
    }

    public clickItem(e: Partial<MouseEvent>, itemId: ItemsIds) {
        if (e.type === 'mouseup') {
            if (e.button == 0) {
                this.client.tryBuyItem(itemId)
            }
        } else {
            this.client.tryBuyItem(itemId)
        }
    }

    public removeAllItems() {
        for (let i=0; i < this.size; i++) {
            const anyItemAtPosition = this.items[i] != undefined && this.items[i] != null
            if (anyItemAtPosition) {
                const canvasId = this.items[i].layer.canvasId
                const canvasBtnDiv = document.getElementById(`div-${canvasId}`)!
                this.itemsHolderEl.removeChild(canvasBtnDiv)
            }
        }
        this.items.splice(0);
    }

    private getItemSprite(itemId: ItemsIds) {
        let keyOfItemId = ItemsIds[itemId]
        let items = Items as any
        return items[keyOfItemId]
    }

    private addCanvasNode(itemId: ItemsIds, itemPrice: number): string {
        let elementId = `store-${itemId}-${this.itemsCount}`
        let newButton = document.createElement('canvas')
        let newSpan = document.createElement('span')
        newSpan.id = `div-${elementId}`
        newSpan.style.maxHeight = '48px'
        newSpan.style.maxWidth = '32px'

        newButton.classList.add('item-btn');
        newButton.id = elementId
        newButton.onmouseup = (e) => this.clickItem(e, itemId)
        newButton.ontouchstart = (e) => this.clickItem(e, itemId)
        newButton.ontouchmove = (e) => this.clickItem(e, itemId)
        newButton.oncontextmenu = () => false
        newSpan.appendChild(newButton)
        this.itemsHolderEl.appendChild(newSpan)
        this.organizeStore();
        return elementId
    }

    private organizeStore(): void {
        const inventoryList = <HTMLCanvasElement[]> Array.from(this.itemsHolderEl.childNodes);

        this.itemsHolderEl.textContent = '';

        inventoryList.sort((a, b) => +a.id.split('-')[0] - +b.id.split('-')[0]).forEach(item => {
            this.itemsHolderEl.appendChild(item);
        });
    }
}