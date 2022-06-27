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
    private isPlayerBuying: boolean = false
    private isPlayerSelling: boolean = false

    constructor(client: GameClient) {
        this.itemsHolderEl = document.getElementById('store-items')!
        this.client = client
    }

    public setPlayerIsBuying() {
        this.isPlayerBuying = true
        this.isPlayerSelling = false
    }

    public setPlayerIsSelling() {
        this.isPlayerBuying = false
        this.isPlayerSelling = true
    }

    public setStoreClosed() {
        this.isPlayerBuying = false
        this.isPlayerSelling = false
        this.merchantId = 0
    }

    public drawItems() {
        for (const item of this.items) {
            item.draw(this.isPlayerBuying)
        }
    }

    public addItem(itemId: ItemsIds, itemPrice: number) {
        if (this.items.length < this.size) {
            this.itemsCount++
            const itemSprite = this.getItemSprite(itemId)
            const canvasId = this.addCanvasNode(itemId, itemPrice)
            this.items.push(new StoreItem(this,itemId,itemSprite,canvasId,itemPrice))
        }
    }

    public removeItem(itemId: ItemsIds) {
        if (itemId != ItemsIds.Empty) {
            const index = this.items.map(item => { return item.itemId; }).indexOf(itemId);
            const canvasId = this.items[index]?.layer.canvasId
            if (index > -1) {
                this.items.splice(index, 1);
            }
            if (canvasId) {
                const divBtn = document.getElementById(`div-${canvasId}`)!
                this.itemsHolderEl.removeChild(divBtn)
            }
        }
    }

    public clickItem(e: Partial<MouseEvent>, itemId: ItemsIds) {
        if (e.type === 'mouseup') {
            if (e.button == 0) {
                if (this.isPlayerBuying) {
                    this.client.tryBuyItem(itemId)
                } else if (this.isPlayerSelling) {
                    this.client.trySellItem(itemId)
                }
            }
        } else if (e.type === 'touchend') {
            if (this.isPlayerBuying) {
                this.client.tryBuyItem(itemId)
            } else if (this.isPlayerSelling) {
                this.client.trySellItem(itemId)
            }
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