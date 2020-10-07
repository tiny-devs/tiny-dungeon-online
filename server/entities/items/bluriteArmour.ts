import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BluriteArmour extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BluriteArmour, ItemType.Weareable, GearType.Torso, 0, 0, 20, true, 0, 0, 0, dropChance)
    }
}