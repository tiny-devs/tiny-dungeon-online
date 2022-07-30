import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts"

export default class WoodenDagger extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.WoodenDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 1, false, 1, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.WoodenDagger), sellPrice.WoodenDagger)
    }
}