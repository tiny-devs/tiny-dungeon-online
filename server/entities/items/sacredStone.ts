import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class SacredStone extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.SacredStone, ItemType.Quest, GearType.None, 0, 0, 0, false, 0, 0, 0, dropChance, 0, 0)
    }
}