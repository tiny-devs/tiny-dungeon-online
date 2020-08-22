import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BronzeDagger extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BronzeDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 2, 0, 5, dropChance)
    }
}