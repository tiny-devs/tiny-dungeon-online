import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class AdamantDagger extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.AdamantDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 40, false, 4, 0, 0, dropChance)
    }
}