import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class AdamantDagger extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.AdamantDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 40, false, 4, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.AdamantDagger), sellPrice.AdamantDagger)
    }
}