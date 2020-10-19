import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BronzeSword extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BronzeSword, ItemType.Weareable, GearType.Weapon, 0, 0, 10, false, 0, 1, 0, dropChance)
    }
}