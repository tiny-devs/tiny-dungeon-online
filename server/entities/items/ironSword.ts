import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class IronSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.IronSword, ItemType.Weareable, GearType.Weapon, 0, 0, 20, false, 0, 2, 0, dropChance)
    }
}