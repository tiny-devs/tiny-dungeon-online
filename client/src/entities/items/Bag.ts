import { ItemsIds } from '../../../../shared/Enums'
import BagItem from "./BagItem"
import { Items } from "./Items"
import { GameClient } from "../../startup/GameClient"
import ContextMenu from '../../contextMenu/ContextMenu'

const LONG_PRESS_DURATION_MS = 500
const TOUCH_MOVE_TOLERANCE_PX = 10

type TouchGestureStatus = 'pending' | 'held' | 'cancelled'

interface TouchGesture {
    timer: number | null
    touchId: number
    startX: number
    startY: number
    status: TouchGestureStatus
}

export default class Bag {
    public items: any[] = []
    public coins: number = 0
    public size: number = 24
    public playerId: string = ''
    public itemsHolderEl: HTMLElement
    public coinsEl: HTMLElement
    private client: GameClient
    private itemsCount: number = 0
    private contextMenu: ContextMenu
    private touchGestures = new Map<HTMLCanvasElement, TouchGesture>()

    constructor(client: GameClient) {
        this.contextMenu = new ContextMenu(client)
        this.itemsHolderEl = document.getElementById('items')!
        this.coinsEl = document.getElementById('coins')!
        this.client = client

        window.addEventListener('touchstart', e => {
            if (e.touches.length > 1) {
                this.cancelAllTouchGestures()
            }
        }, { passive: true })
    }

    public drawItems() {
        for (const item of this.items) {
            item.draw()
        }
    }

    public addGold(amount: number) {
        this.coins += amount
        this.coinsEl.innerHTML = `GP: ${this.coins}`
    }

    public setGold(currentGold: number) {
        this.coins = currentGold
        this.coinsEl.innerHTML = `GP: ${this.coins}`
    }

    public addItem(itemId: ItemsIds, coins: number, playerId: string) {
        if (this.playerId == playerId) {
            if (itemId == ItemsIds.Coin) {
                this.addGold(coins)
            } else {
                if (this.items.length < this.size) {
                    this.itemsCount++
                    const itemSprite = this.getItemSprite(itemId)
                    const canvasId = this.addCanvasNode(itemId)
                    this.items.push(new BagItem(this,itemId,itemSprite,canvasId))
                    this.drawItems()
                }
            }
        }
    }

    public clickItem(e: Partial<MouseEvent>, itemId: ItemsIds) {
        if (e.type === 'mouseup') {
            if (e.button == 0) {
                // Bank open: left-click stores to bank (mirrors store-sell click → SellItemStore)
                if (this.client.bankOpen) {
                    this.client.storeItem(itemId)
                } else {
                    this.client.useItem(itemId)
                }
            } else if (e.button == 2) {
                this.contextMenu.openMenu(itemId, e.clientX ?? 0, e.clientY ?? 0)
            }
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
                const canvasBtn = document.getElementById(canvasId) as HTMLCanvasElement | null
                if (canvasBtn) {
                    this.discardTouchGesture(canvasBtn)
                    this.itemsHolderEl.removeChild(canvasBtn)
                }
            }
        }
    }

    public removeAllItems() {
        for (let i=0; i < this.size; i++) {
            const anyItemAtPosition = this.items[i] != undefined && this.items[i] != null
            if (anyItemAtPosition) {
                const canvasId = this.items[i].layer.canvasId
                const canvasBtn = document.getElementById(canvasId) as HTMLCanvasElement | null
                if (canvasBtn) {
                    this.discardTouchGesture(canvasBtn)
                    this.itemsHolderEl.removeChild(canvasBtn)
                }
            }
        }
        this.discardAllTouchGestures()
        this.items.splice(0);
    }

    public getItemSprite(itemId: ItemsIds) {
        let keyOfItemId = ItemsIds[itemId]
        let items = Items as any
        return items[keyOfItemId]
    }

    private addCanvasNode(itemId: ItemsIds): string {
        let elementId = `${itemId}-${this.itemsCount}`
        let newButton = document.createElement('canvas')
        newButton.classList.add('item-btn');
        newButton.id = elementId
        newButton.onmouseup = (e) => this.clickItem(e, itemId)
        newButton.addEventListener('touchstart', e => this.startTouchGesture(e, newButton, itemId), { passive: true })
        newButton.addEventListener('touchmove', e => this.moveTouchGesture(e, newButton), { passive: true })
        newButton.addEventListener('touchend', e => this.endTouchGesture(e, newButton, itemId), { passive: false })
        newButton.addEventListener('touchcancel', () => this.discardTouchGesture(newButton), { passive: true })
        newButton.oncontextmenu = () => false
        this.itemsHolderEl.appendChild(newButton)
        this.organizeBag();
        return elementId
    }

    private startTouchGesture(e: TouchEvent, canvas: HTMLCanvasElement, itemId: ItemsIds): void {
        if (e.touches.length !== 1) {
            this.cancelTouchGesture(canvas)
            return
        }

        this.discardTouchGesture(canvas)
        const touch = e.touches[0]
        const gesture: TouchGesture = {
            timer: null,
            touchId: touch.identifier,
            startX: touch.clientX,
            startY: touch.clientY,
            status: 'pending'
        }

        gesture.timer = window.setTimeout(() => {
            if (
                gesture.status !== 'pending' ||
                !canvas.isConnected ||
                canvas.parentNode !== this.itemsHolderEl ||
                this.touchGestures.get(canvas) !== gesture
            ) {
                return
            }

            gesture.timer = null
            gesture.status = 'held'
            this.contextMenu.openMenu(itemId, gesture.startX, gesture.startY)
        }, LONG_PRESS_DURATION_MS)

        this.touchGestures.set(canvas, gesture)
    }

    private moveTouchGesture(e: TouchEvent, canvas: HTMLCanvasElement): void {
        const gesture = this.touchGestures.get(canvas)
        if (!gesture || gesture.status !== 'pending') return

        const touch = this.findTouch(e.touches, gesture.touchId)
        if (!touch || e.touches.length !== 1) {
            this.cancelTouchGesture(canvas)
            return
        }

        const deltaX = touch.clientX - gesture.startX
        const deltaY = touch.clientY - gesture.startY
        if (deltaX * deltaX + deltaY * deltaY > TOUCH_MOVE_TOLERANCE_PX * TOUCH_MOVE_TOLERANCE_PX) {
            this.cancelTouchGesture(canvas)
        }
    }

    private endTouchGesture(e: TouchEvent, canvas: HTMLCanvasElement, itemId: ItemsIds): void {
        const gesture = this.touchGestures.get(canvas)
        if (!gesture || !this.findTouch(e.changedTouches, gesture.touchId)) return

        e.preventDefault()
        if (gesture.timer !== null) {
            window.clearTimeout(gesture.timer)
        }
        this.touchGestures.delete(canvas)

        if (gesture.status === 'pending') {
            if (this.client.bankOpen) {
                this.client.storeItem(itemId)
            } else {
                this.client.useItem(itemId)
            }
        }
    }

    private findTouch(touches: TouchList, touchId: number): Touch | null {
        for (let i = 0; i < touches.length; i++) {
            if (touches[i].identifier === touchId) return touches[i]
        }
        return null
    }

    private cancelTouchGesture(canvas: HTMLCanvasElement): void {
        const gesture = this.touchGestures.get(canvas)
        if (!gesture) return

        if (gesture.timer !== null) {
            window.clearTimeout(gesture.timer)
            gesture.timer = null
        }
        gesture.status = 'cancelled'
    }

    private discardTouchGesture(canvas: HTMLCanvasElement): void {
        this.cancelTouchGesture(canvas)
        this.touchGestures.delete(canvas)
    }

    private cancelAllTouchGestures(): void {
        this.touchGestures.forEach((_, canvas) => this.cancelTouchGesture(canvas))
    }

    private discardAllTouchGestures(): void {
        this.touchGestures.forEach((_, canvas) => this.discardTouchGesture(canvas))
    }

    private organizeBag(): void {
        const inventoryList = <HTMLCanvasElement[]> Array.from(this.itemsHolderEl.childNodes);

        this.itemsHolderEl.textContent = '';

        inventoryList.sort((a, b) => +a.id.split('-')[0] - +b.id.split('-')[0]).forEach(item => {
            this.itemsHolderEl.appendChild(item);
        });
    }
}
