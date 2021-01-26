import { Items, ItemType, GearType } from "../../../Enums.ts"
import ItemBase from "../itemBase.ts"

export default class Bread extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.Bread, ItemType.Consumable, GearType.None, 0, 0, 0, false, 0, 0, 10, dropChance)
    }
}