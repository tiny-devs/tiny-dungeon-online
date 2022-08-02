import { ItemsIds } from '../../../shared/Enums'

export class ParseItemUse {
    public itemId: ItemsIds

    constructor(data: string) {
        const itemId = this.parseString(data)

        this.itemId = itemId
    }

    private parseString(eventDataString: string): ItemsIds {
        let itemIdString = eventDataString.split(',')
        let itemId = +itemIdString[1]

        return itemId
    }
}