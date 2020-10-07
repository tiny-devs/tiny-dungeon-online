import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class AdamantDagger extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.AdamantDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 30, false, 3, 0, 0, dropChance)
    }
}