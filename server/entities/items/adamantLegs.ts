import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class AdamantLegs extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.AdamantLegs, ItemType.Weareable, GearType.Legs, 0, 0, 40, true, 0, 0, 0, dropChance)
    }
}