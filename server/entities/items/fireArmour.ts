import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class FireArmour extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.FireArmour, ItemType.Weareable, GearType.Torso, 0, 0, 50, true, 0, 0, 0, dropChance)
    }
}