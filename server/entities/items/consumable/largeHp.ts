import { Items, ItemType, GearType } from "../../../Enums.ts"
import ItemBase from "../itemBase.ts"

export default class LargeHp extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.LargeHp, ItemType.Consumable, GearType.None, 0, 0, 0, false, 0, 0, 30, dropChance)
    }
}