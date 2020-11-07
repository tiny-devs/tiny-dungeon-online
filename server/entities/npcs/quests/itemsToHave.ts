import { Items } from "../../../Enums.ts"
import { ItemsToHaveBase } from "./itemsToHaveBase.ts"

export class ItemsToHave {
    public item: Items
    public amount: number

    constructor(itemsBase: ItemsToHaveBase) {
        this.item = itemsBase.item
        this.amount = itemsBase.amount
    }
}