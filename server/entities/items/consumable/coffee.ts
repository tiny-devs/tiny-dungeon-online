import { ItemsIds, ItemType, GearType } from "../../../../shared/Enums.ts"
import ItemBase from "../itemBase.ts"
import { buyPrice, sellPrice } from "../itemPrices.ts";

export default class Coffee extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, ItemsIds.Coffee, ItemType.Consumable, GearType.None, 0, 0, 0, false, 0, 0, 5, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.Coffee), sellPrice.Coffee)
    }
}