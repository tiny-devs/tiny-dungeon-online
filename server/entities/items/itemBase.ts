import { Items, ItemType, GearType } from "../../Enums.ts"

export default class ItemBase {
    public id: number
    public itemId: Items
    public type: ItemType
    public gearType: GearType
    public despawnTime: number
    public coins: number
    public level: number
    public bonusAttack: number
    public bonusDefense: number
    public healthRefuel: number
    public dropChance: number
    public isDefensive: boolean

    constructor(id: number,
    itemId: Items,
    type: ItemType,
    gearType: GearType,
    coins: number,
    despawnTime: number,
    level: number,
    isDefensive: boolean,
    bonusAttack: number,
    bonusDefense: number,
    healthRefuel: number,
    dropChance: number) {
        this.id = id
        this.itemId = itemId
        this.type = type
        this.gearType = gearType
        this.despawnTime = despawnTime == 0 ? 30000 : despawnTime
        this.coins = coins
        this.level = level
        this.isDefensive = isDefensive
        this.bonusAttack = !isDefensive ? Math.floor(level/2) + 2 + bonusAttack : bonusAttack
        this.bonusDefense = isDefensive ? Math.floor(level/2) + 1 + bonusDefense : bonusDefense
        this.healthRefuel = healthRefuel
        this.dropChance = dropChance
    }
}