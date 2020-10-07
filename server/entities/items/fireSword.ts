import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class FireSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.FireSword, ItemType.Weareable, GearType.Weapon, 0, 0, 40, false, 0, 4, 0, dropChance)
    }
}