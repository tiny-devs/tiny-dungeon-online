import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class BronzeLegs extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.BronzeLegs, ItemType.Weareable, GearType.Legs, 0, 0, 10, true, 0, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.BronzeLegs), sellPrice.BronzeLegs)
    }
}