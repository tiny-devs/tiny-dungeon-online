import { Items } from "../../Enums.ts"

export default class ItemBase {
    public id: number
    public itemId: Items
    public money: boolean
    public consumable: boolean
    public wearable: boolean
    public temporary: boolean
    public despawnTime: number
    public coins: number
    public bonusAttack: number
    public bonusDefense: number
    public healthRefuel: number
    public dropChance: number

    constructor(id: number,
    itemId: Items,
    money: boolean,
    consumable: boolean,
    wearable: boolean,
    temporary: boolean,
    coins: number,
    despawnTime: number,
    bonusAttack: number,
    bonusDefense: number,
    healthRefuel: number,
    dropChance: number) {
        this.id = id
        this.itemId = itemId
        this.money = money
        this.consumable = consumable
        this.wearable = wearable
        this.temporary = temporary
        this.despawnTime = despawnTime
        this.coins = coins
        this.bonusAttack = bonusAttack
        this.bonusDefense = bonusDefense
        this.healthRefuel = healthRefuel
        this.dropChance = dropChance
    }
}