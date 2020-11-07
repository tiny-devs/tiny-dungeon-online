import ItemBase from "./itemBase.ts"
import { Player } from "../player.ts"
import { GearType, Items } from "../../Enums.ts"
import { ClientHandler } from "../../clientHandler.ts"

export default class Gear {
    public head: ItemBase | null = null
    public torso: ItemBase | null = null
    public legs: ItemBase | null = null
    public weapon: ItemBase | null = null
    private player: Player
    private clientHandler: ClientHandler

    constructor(player: Player, clientHandler: ClientHandler) {
        this.player = player
        this.clientHandler = clientHandler
    }

    public wear(item: ItemBase, loading: boolean): boolean {
        let hasMinimumLevel = true
        let wore = false
        switch (item.gearType) {
            case GearType.Head:
                if (this.head == null) {
                    if (item.level <= this.player.level) {
                        this.head = item
                        wore = true
                    } else {
                        hasMinimumLevel = false
                    }
                }
                break;
            case GearType.Torso:
                if (this.torso == null) {
                    if (item.level <= this.player.level) {
                        this.torso = item
                        wore = true
                    } else {
                        hasMinimumLevel = false
                    }
                }
                break;
            case GearType.Legs:
                if (this.legs == null) {
                    if (item.level <= this.player.level) {
                        this.legs = item
                        wore = true
                    } else {
                        hasMinimumLevel = false
                    }
                }
                break;
            case GearType.Weapon:
                if (this.weapon == null) {
                    if (item.level <= this.player.level) {
                        this.weapon = item
                        wore = true
                    } else {
                        hasMinimumLevel = false
                    }
                }
                break;
            default:
                break;
        }

        if (wore) {
            if (!loading) {
                this.clientHandler.unicastItemWear(this.player, item.itemId, item.gearType)
            }
        } else if (!hasMinimumLevel) {
            if (!loading) {
                this.clientHandler.unicastMessage(this.player, `"You need LVL ${item.level} to wear this"`)
            }
        }

        return wore
    }

    public remove(itemId: Items): boolean {
        let removed = false
        if (this.head?.itemId == itemId) {
            removed = this.player.bag.addItem(this.head)
            if (removed) {
                this.head = null
            }
        }
        if (this.torso?.itemId == itemId) {
            removed = this.player.bag.addItem(this.torso)
            if (removed) {
                this.torso = null
            }
        }
        if (this.legs?.itemId == itemId) {
            removed = this.player.bag.addItem(this.legs)
            if (removed) {
                this.legs = null
            }
        }
        if (this.weapon?.itemId == itemId) {
            removed = this.player.bag.addItem(this.weapon)
            if (removed) {
                this.weapon = null
            }
        }

        return removed
    }

    public getDefenseBonus() {
        const headBonus = this.head?.bonusDefense != null ? this.head?.bonusDefense : 0
        const torsoBonus = this.torso?.bonusDefense != null ? this.torso?.bonusDefense : 0
        const legsBonus = this.legs?.bonusDefense != null ? this.legs?.bonusDefense : 0
        const weaponBonus = this.weapon?.bonusDefense != null ? this.weapon?.bonusDefense : 0

        return headBonus + torsoBonus + legsBonus + weaponBonus
    }

    public getAttackBonus() {
        const headBonus = this.head?.bonusAttack != null ? this.head?.bonusAttack : 0
        const torsoBonus = this.torso?.bonusAttack != null ? this.torso?.bonusAttack : 0
        const legsBonus = this.legs?.bonusAttack != null ? this.legs?.bonusAttack : 0
        const weaponBonus = this.weapon?.bonusAttack != null ? this.weapon?.bonusAttack : 0

        return headBonus + torsoBonus + legsBonus + weaponBonus
    }
}