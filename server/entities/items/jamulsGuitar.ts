import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class JamulsGuitar extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.JamulsGuitar, ItemType.Weareable, GearType.Weapon, 0, 0, 1, true, 0, 0, 0, dropChance, 0, 0)
    }
}