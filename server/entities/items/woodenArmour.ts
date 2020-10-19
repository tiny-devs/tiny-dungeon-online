import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class WoodenArmour extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.WoodenArmour, ItemType.Weareable, GearType.Torso, 0, 0, 1, true, 0, 0, 0, dropChance)
    }
}