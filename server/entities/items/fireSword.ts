import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class FireSword extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.FireSword, ItemType.Weareable, GearType.Weapon, 0, 0, 50, false, 0, 4, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.FireSword), sellPrice.FireSword)
    }
}