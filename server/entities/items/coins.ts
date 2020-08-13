import { Items } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class Coins extends ItemBase {

    constructor(dropChance: number, coins: number) {
        super(0, Items.Coins, true, false, false, false, coins, 0, 0, 0, 5, dropChance)
    }
}