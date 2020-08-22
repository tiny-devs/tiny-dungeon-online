import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class Coffee extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.Coffee, ItemType.Consumable, GearType.None, 0, 0, 0, 0, 5, dropChance)
    }
}