import { Items } from "../../../../shared/Enums.ts"
import ItemBase from "../itemBase.ts"
import { Player } from "../../player.ts"

export default class Bank {
    public items: ItemBase[] = []
    public size = 72
    private player: Player

    constructor(player: Player) { 
        this.player = player
    }

    public retrieveItem(itemId: Items): boolean {
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

    public storeItem(item: ItemBase): boolean {
        if (this.items.length < this.size) {
            this.items.push(item)
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