import { ItemsIds } from "../models/Enums"

export class ParseItemRemove {
    public itemId: ItemsIds

    constructor(data: string) {
        const removeData = this.parseString(data)

        this.itemId = +removeData[1]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
