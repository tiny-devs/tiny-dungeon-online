import { ItemsIds } from "../models/Enums"

export class ParseItemPick {
    public playerId: string
    public itemId: ItemsIds
    public coins: number
    public x: number
    public y: number

    constructor(data: string) {
        const pickData = this.parseString(data)

        this.playerId = pickData[1]
        this.itemId = +pickData[2]
        this.coins = +pickData[3]
        this.x = +pickData[4]
        this.y = +pickData[5]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
