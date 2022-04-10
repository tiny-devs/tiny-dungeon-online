import { Items, ItemType, GearType } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class BluriteSword extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.BluriteSword, ItemType.Weareable, GearType.Weapon, 0, 0, 30, false, 0, 2, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.BluriteSword), sellPrice.BluriteSword)
    }
}