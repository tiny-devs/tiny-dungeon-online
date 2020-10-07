import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class AdamantSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.AdamantSword, ItemType.Weareable, GearType.Weapon, 0, 0, 30, false, 0, 3, 0, dropChance)
    }
}