import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BronzeHelm extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BronzeHelm, ItemType.Weareable, GearType.Head, 0, 0, 1, true, 0, 0, 0, dropChance)
    }
}