import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class AdamantSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.AdamantSword, ItemType.Weareable, GearType.Weapon, 0, 0, 40, false, 0, 4, 0, dropChance)
    }
}