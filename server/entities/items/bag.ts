import { Items } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"
import { Player } from "../player.ts"

export default class Bag {
    public items: ItemBase[] = []
    public size: number = 10
    private player: Player

    constructor(player: Player) { 
        this.player = player
    }

    public useItem(itemId: Items): boolean {
        const item = this.items.find(i => i.id == itemId)
        if (item) {
            if (item.consumable) {
                this.player.hp = ((item.healthRefuel + this.player.hp) > this.player.maxHp) ? this.player.maxHp : (item.healthRefuel + this.player.hp)
                this.removeItem(item)
            }
            // if (item.wearable) 
            //     //wear item and apply bonuses
            // if ....
            return true
        }
        return false
    }

    public dropItem(itemId: Items): boolean {
        const item = this.items.find(i => i.id == itemId)
        if (item) {
            if (this.player.currentRoom.itemsLayer[this.player.y][this.player.x] === 0) {
                this.player.currentRoom.itemsLayer[this.player.y][this.player.x] = item
                this.removeItem(item)
            }
            return true
        }
        return false
    }

    public addItem(item: ItemBase): boolean {
        if (this.items.length < this.size) {
            this.items.push(item)
            return true
        }
        return false
    }

    removeItem(item: ItemBase) {
        const index = this.items.indexOf(item)
        if (index > -1) {
            this.items.splice(index, 1)
        }
    }
}