import { ItemsIds } from "../models/Enums"

export class ParseItemDroped {
    public itemId: ItemsIds

    constructor(data: string) {
        const dropedData = this.parseString(data)

        this.itemId = +dropedData[1]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
