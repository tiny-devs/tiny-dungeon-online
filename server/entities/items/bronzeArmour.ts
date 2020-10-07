import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BronzeArmour extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BronzeArmour, ItemType.Weareable, GearType.Torso, 0, 0, 1, true, 0, 0, 0, dropChance)
    }
}