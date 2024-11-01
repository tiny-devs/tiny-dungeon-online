import { ItemsIds, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class BronzeDagger extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, ItemsIds.BronzeDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 10, false, 1, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.BronzeDagger), sellPrice.BronzeDagger)
    }
}