import { ItemsIds } from '../../../../shared/Enums'
import BankItem from "./BankItem"
import { Items } from "./Items"
import { GameClient } from "../../startup/GameClient"

export default class Bank {
    public items: any[] = []
    public size: number = 72
    public coins: number = 0
    public itemsHolderEl: HTMLElement
    public coinsEl: HTMLElement
    private client: GameClient
    private itemsCount: number = 0

    constructor(client: GameClient) {
        this.itemsHolderEl = document.getElementById('bank-items')!
        this.coinsEl = document.getElementById('bank-coins')!
        this.client = client
        this.coinsEl.onclick = () => {
            this.client.showBankCoinsWithdraw()
        }
    }

    public drawItems() {
        for (const item of this.items) {
            item.draw()
        }
    }

    public setGold(currentGold: number) {
        this.coins = currentGold
        this.coinsEl.innerHTML = `Bank GP: ${this.coins}`
    }

    public addItem(itemId: ItemsIds) {
        if (this.items.length < this.size) {
            this.itemsCount++
            const itemSprite = this.getItemSprite(itemId)
            const canvasId = this.addCanvasNode(itemId)
            this.items.push(new BankItem(this, itemId, itemSprite, canvasId))
            this.drawItems()
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
                const canvasBtn = document.getElementById(canvasId)!
                if (canvasBtn && canvasBtn.parentNode === this.itemsHolderEl) {
                    this.itemsHolderEl.removeChild(canvasBtn)
                }
            }
        }
    }

    public clickItem(e: Partial<MouseEvent> | TouchEvent, itemId: ItemsIds) {
        if (e.type === 'mouseup') {
            if ((e as Partial<MouseEvent>).button == 0) {
                this.client.tryRetrieveItem(itemId)
            }
        } else if (e.type === 'touchend') {
            this.client.tryRetrieveItem(itemId)
        }
    }

    public removeAllItems() {
        for (let i = 0; i < this.size; i++) {
            const anyItemAtPosition = this.items[i] != undefined && this.items[i] != null
            if (anyItemAtPosition) {
                const canvasId = this.items[i].layer.canvasId
                const canvasBtn = document.getElementById(canvasId)!
                if (canvasBtn && canvasBtn.parentNode === this.itemsHolderEl) {
                    this.itemsHolderEl.removeChild(canvasBtn)
                }
            }
        }
        this.items.splice(0);
    }

    private getItemSprite(itemId: ItemsIds) {
        let keyOfItemId = ItemsIds[itemId]
        let items = Items as any
        return items[keyOfItemId]
    }

    private addCanvasNode(itemId: ItemsIds): string {
        let elementId = `bank-${itemId}-${this.itemsCount}`
        let newButton = document.createElement('canvas')
        newButton.classList.add('item-btn');
        newButton.id = elementId
        newButton.onmouseup = (e) => this.clickItem(e, itemId)
        let touchMoved = false
        newButton.addEventListener('touchstart', () => { touchMoved = false }, { passive: true })
        newButton.addEventListener('touchmove', () => { touchMoved = true }, { passive: true })
        newButton.addEventListener('touchend', (e) => { if (!touchMoved) { e.preventDefault(); this.clickItem(e, itemId) } }, { passive: false })
        newButton.oncontextmenu = () => false
        this.itemsHolderEl.appendChild(newButton)
        this.organizeBank();
        return elementId
    }

    private organizeBank(): void {
        const inventoryList = <HTMLCanvasElement[]> Array.from(this.itemsHolderEl.childNodes);

        this.itemsHolderEl.textContent = '';

        inventoryList.sort((a, b) => {
            const aId = +a.id.split('-')[1]
            const bId = +b.id.split('-')[1]
            return aId - bId
        }).forEach(item => {
            this.itemsHolderEl.appendChild(item);
        });
    }
}
