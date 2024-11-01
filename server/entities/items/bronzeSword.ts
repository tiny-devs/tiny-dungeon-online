import { ItemsIds, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class BronzeSword extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, ItemsIds.BronzeSword, ItemType.Weareable, GearType.Weapon, 0, 0, 10, false, 0, 1, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.BronzeSword), sellPrice.BronzeSword)
    }
}