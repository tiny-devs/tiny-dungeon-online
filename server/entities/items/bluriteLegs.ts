import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BluriteLegs extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BluriteLegs, ItemType.Weareable, GearType.Legs, 0, 0, 20, true, 0, 0, 0, dropChance)
    }
}