import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class JamulsMachete extends ItemBase {

    constructor(dropChance: number) {
        super(0, Items.JamulsMachete, ItemType.Quest, GearType.None, 0, 0, 0, false, 0, 0, 0, dropChance, 0, 0)
    }
}