import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class AdamantArmour extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.AdamantArmour, ItemType.Weareable, GearType.Torso, 0, 0, 30, true, 0, 0, 0, dropChance)
    }
}