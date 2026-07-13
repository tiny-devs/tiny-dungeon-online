import { ItemsIds, ItemType } from "../../../../shared/Enums.ts"
import ItemBase from "../itemBase.ts"
import { Player } from "../../player.ts"

export default class Bank {
    public items: ItemBase[] = []
    public coins = 0
    public size = 72
    private player: Player
    /** True after a successful store/retrieve until the bank is closed and saved. */
    private dirty = false

    constructor(player: Player) {
        this.player = player
    }

    public markDirty() {
        this.dirty = true
    }

    /** Returns true once if bank changed since last close/save, then clears the flag. */
    public consumeDirty(): boolean {
        if (!this.dirty) {
            return false
        }
        this.dirty = false
        return true
    }

    private isPlayerNearBanker(): boolean {
        const room = this.player.currentRoom
        if (!room) {
            return false
        }
        return room.npcs.some(n =>
            n.isBanker &&
            !n.dead &&
            n.roomId === this.player.currentRoomId
        )
    }

    public storeItem(itemId: ItemsIds): boolean {
        if (!this.isPlayerNearBanker()) {
            return false
        }
        const item = this.player.bag.items.find(i => i.itemId == itemId)
        if (!item) {
            return false
        }
        const isQuestItem = item.type === ItemType.Quest || item.type === ItemType.QuestConsumable
        if (isQuestItem && !this.player.isAdmin()) {
            return false
        }
        if (this.items.length >= this.size) {
            return false
        }
        this.player.bag.removeItem(item)
        this.items.push(item)
        return true
    }

    public storeGold(amount: number): boolean {
        if (!this.isPlayerNearBanker()) {
            return false
        }
        if (amount > 0 && amount <= this.player.bag.coins) {
            this.player.bag.coins -= amount
            this.coins += amount
            return true
        }
        return false
    }

    public retrieveItem(itemId: ItemsIds): boolean {
        if (!this.isPlayerNearBanker()) {
            return false
        }
        const item = this.items.find(i => i.itemId == itemId)
        if (item) {
            const success = this.player.bag.addItem(item)
            if (success) {
                this.removeItem(item)
                return true
            }
        }
        return false
    }

    public retrieveGold(amount: number): boolean {
        if (!this.isPlayerNearBanker()) {
            return false
        }
        if (amount > 0 && amount <= this.coins) {
            this.coins -= amount
            this.player.bag.coins += amount
            return true
        }
        return false
    }

    private removeItem(item: ItemBase) {
        const index = this.items.indexOf(item)
        if (index > -1) {
            this.items.splice(index, 1)
        }
    }
}
