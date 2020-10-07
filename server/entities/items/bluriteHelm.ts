import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BluriteHelm extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BluriteHelm, ItemType.Weareable, GearType.Head, 0, 0, 20, true, 0, 0, 0, dropChance)
    }
}