import { ItemsIds } from '../../../shared/Enums'

export class ParseLoadBag {
    public id: string
    public itemsIds: ItemsIds[]

    constructor(data: string) {
        const parsedData = this.parseString(data)

        this.id = parsedData[0][1]
        this.itemsIds = parsedData[1]
    }

    private parseString(eventDataString: string): any[][] {
        const allData = eventDataString.split('@')

        const playerId = allData[0].split(',')

        let itemsData = []
        if (allData[1]) {
            const itemsDataStrings = allData[1].split(',')
            for (const itemId of itemsDataStrings) {
                if (itemId != '') {
                    itemsData.push(+itemId)
                }
            }
        }

        return [playerId,itemsData]
    }
}