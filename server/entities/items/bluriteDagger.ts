import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class BluriteDagger extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.BluriteDagger, ItemType.Weareable, GearType.Weapon, 0, 0, 30, false, 2, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.BluriteDagger), sellPrice.BluriteDagger)
    }
}