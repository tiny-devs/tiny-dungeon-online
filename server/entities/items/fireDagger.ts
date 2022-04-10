import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class FireDagger extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.FireDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 50, false, 4, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.FireDagger), sellPrice.FireDagger)
    }
}