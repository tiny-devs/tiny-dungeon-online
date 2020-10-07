import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class BluriteDagger extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.BluriteDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 20, false, 2, 0, 0, dropChance)
    }
}