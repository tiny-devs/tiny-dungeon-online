import { Items } from "../../../Enums.ts"

export class ItemsToHaveBase {
    public item: Items
    public amount: number

    constructor(item: Items,
      amount: number) {
        this.item = item
        this.amount = amount
    }
}