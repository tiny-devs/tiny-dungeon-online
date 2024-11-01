import { ItemsIds, ItemType, GearType } from "../../../../shared/Enums.ts"
import ItemBase from "../itemBase.ts"
import { buyPrice, sellPrice } from "../itemPrices.ts";

export default class LargeHp extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, ItemsIds.LargeHp, ItemType.Consumable, GearType.None, 0, 0, 0, false, 0, 0, 30, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.LargeHp), sellPrice.LargeHp)
    }
}