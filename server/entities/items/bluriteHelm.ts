import { Items, ItemType, GearType } from "../../../shared/Enums.ts"
import ItemBase from "./itemBase.ts"
import { buyPrice, sellPrice } from "./itemPrices.ts";

export default class BluriteHelm extends ItemBase {

    constructor(dropChance: number, customBuyPrice: number = 0) {
        super(0, Items.BluriteHelm, ItemType.Weareable, GearType.Head, 0, 0, 30, true, 0, 0, 0, dropChance, (customBuyPrice !== 0 ? customBuyPrice : buyPrice.BluriteHelm), sellPrice.BluriteHelm)
    }
}