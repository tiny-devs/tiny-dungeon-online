import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"
import { Player } from "../player.ts"

export default class Bag {
    public items: ItemBase[] = []
    public coins: number = 0
    public size: number = 24
    private player: Player

    constructor(player: Player) { 
        this.player = player
    }

    public useItem(itemId: Items): any {
        const item = this.items.find(i => i.itemId == itemId)
        if (item) {
            if (item.type == ItemType.Consumable) {
                this.player.addHp(item.healthRefuel)
                this.removeItem(item)
                return {used:true,wore:false}
            }
            if (item.type == ItemType.Weareable) {
                const wore = this.player.gear.wear(item)
                if (wore) {
                    this.removeItem(item)
                }
                return {used:false,wore:true}
            }
        }

        return {used:false,wore:false}
    }

    public dropItem(itemId: Items): boolean {
        const item = this.items.find(i => i.itemId == itemId)
        if (item) {
            if (this.player.currentRoom.itemsLayer[this.player.y][this.player.x] === 0) {
                this.player.currentRoom.addItem(this.player.y,this.player.x,item)
                this.removeItem(item)
                return true
            }
        }
        return false
    }

    public addItem(item: ItemBase): boolean {
        if (item.type == ItemType.Money) {
            this.coins += item.coins
            return true
        } else {
            if (this.items.length < this.size) {
                this.items.push(item)
                return true
            }
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