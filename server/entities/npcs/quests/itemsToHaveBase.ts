import { ItemsIds } from "../../../../shared/Enums.ts"

export class ItemsToHaveBase {
    public item: ItemsIds
    public amount: number

    constructor(item: ItemsIds,
      amount: number) {
        this.item = item
        this.amount = amount
    }
}