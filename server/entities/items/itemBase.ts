import { Items } from "../../Enums.ts"

export default class ItemBase {
    public id: Items
    public consumable: boolean
    public wearable: boolean
    public temporary: boolean
    public despawnTime: number
    public bonusAttack: number
    public bonusDefense: number
    public healthRefuel: number
    public dropChance: number = 1
    public roomId: number

    constructor(id: number,
    consumable: boolean,
    wearable: boolean,
    temporary: boolean,
    despawnTime: number,
    bonusAttack: number,
    bonusDefense: number,
    healthRefuel: number,
    roomId: number) {
        this.id = id
        this.consumable = consumable
        this.wearable = wearable
        this.temporary = temporary
        this.despawnTime = despawnTime
        this.bonusAttack = bonusAttack
        this.bonusDefense = bonusDefense
        this.healthRefuel = healthRefuel
        this.roomId = roomId
    }
}