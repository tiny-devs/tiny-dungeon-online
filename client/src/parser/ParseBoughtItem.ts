import { ItemsIds } from "../models/Enums"

export class ParseBoughtItem {
    public success: boolean
    public message: string
    public itemId: ItemsIds
    public currentCoins: number

    constructor(data: string) {
        const pickData = this.parseString(data)

        this.success = pickData[1] === 'true'
        if (this.success) {
            this.message = 'Success'
            this.itemId = +pickData[3]
            this.currentCoins = +pickData[4]
        } else {
            this.message = pickData[2]
            this.itemId = 0
            this.currentCoins = 0
        }
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
