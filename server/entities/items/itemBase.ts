import { Items, ItemType, GearType } from "../../Enums.ts"

export default class ItemBase {
    public id: number
    public itemId: Items
    public type: ItemType
    public gearType: GearType
    public despawnTime: number
    public coins: number
    public bonusAttack: number
    public bonusDefense: number
    public healthRefuel: number
    public dropChance: number

    constructor(id: number,
    itemId: Items,
    type: ItemType,
    gearType: GearType,
    coins: number,
    despawnTime: number,
    bonusAttack: number,
    bonusDefense: number,
    healthRefuel: number,
    dropChance: number) {
        this.id = id
        this.itemId = itemId
        this.type = type
        this.gearType = gearType
        this.despawnTime = despawnTime
        this.coins = coins
        this.bonusAttack = bonusAttack
        this.bonusDefense = bonusDefense
        this.healthRefuel = healthRefuel
        this.dropChance = dropChance
    }
}