import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class FireDagger extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.FireDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 50, false, 4, 0, 0, dropChance)
    }
}