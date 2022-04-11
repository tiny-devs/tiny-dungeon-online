import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class FireLegs extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.FireLegs, ItemType.Weareable, GearType.Legs, 0, 0, 50, true, 0, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.FireLegs), sellPrice.FireLegs)
    }
}