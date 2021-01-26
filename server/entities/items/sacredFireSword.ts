import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class SacredFireSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.SacredFireSword, ItemType.Weareable, GearType.Weapon, 0, 0, 50, false, 8, 8, 0, dropChance)
    }
}