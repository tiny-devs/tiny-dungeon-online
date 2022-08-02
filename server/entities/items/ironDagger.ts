import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class IronDagger extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.IronDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 20, false, 2, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.IronDagger), sellPrice.IronDagger)
    }
}