import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BronzeLegs extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BronzeLegs, ItemType.Weareable, GearType.Legs, 0, 0, 1, true, 0, 0, 0, dropChance)
    }
}