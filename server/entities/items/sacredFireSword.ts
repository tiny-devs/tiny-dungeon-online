import { ItemsIds, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class SacredFireSword extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, ItemsIds.SacredFireSword, ItemType.Weareable, GearType.Weapon, 0, 0, 50, false, 8, 8, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.SacredFireSword), sellPrice.SacredFireSword)
    }
}