import { Items, ItemType, GearType } from "../../../../shared/Enums.ts"
import ItemBase from "../itemBase.ts"
import { buyPrice, sellPrice } from "../itemPrices.ts";

export default class SmallHp extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.SmallHp, ItemType.Consumable, GearType.None, 0, 0, 0, false, 0, 0, 15, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.SmallHp), sellPrice.SmallHp)
    }
}