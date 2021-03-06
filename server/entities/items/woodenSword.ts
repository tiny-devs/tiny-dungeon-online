import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class WoodenSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.WoodenSword, ItemType.Weareable, GearType.Weapon, 0, 0, 1, false, 0, 1, 0, dropChance)
    }
}