import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class FireLegs extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.FireLegs, ItemType.Weareable, GearType.Legs, 0, 0, 50, true, 0, 0, 0, dropChance)
    }
}