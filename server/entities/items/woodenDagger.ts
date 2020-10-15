import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class WoodenDagger extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.WoodenDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 1, false, 1, 0, 0, dropChance)
    }
}