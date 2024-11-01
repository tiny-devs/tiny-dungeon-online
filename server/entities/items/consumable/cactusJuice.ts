import { ItemsIds, ItemType, GearType } from "../../../../shared/Enums.ts"
import ItemBase from "../itemBase.ts"

export default class CactusJuice extends ItemBase {

    constructor(dropChance: number) {
        super(0, ItemsIds.CactusJuice, ItemType.QuestConsumable, GearType.None, 0, 0, 0, false, 0, 0, 0, dropChance, 0, 0)
    }
}