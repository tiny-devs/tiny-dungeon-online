export class ParseStoreItems {
    public itemsIdsAndPrice: any[]

    constructor(data: string) {
        const parsedData = this.parseString(data)

        this.itemsIdsAndPrice = parsedData
    }

    private parseString(eventDataString: string): any[] {
        const allData = eventDataString.split('@')

        let itemsData = []
        if (allData[1]) {
            const itemsDataStrings = allData[1].split(',')
            for (const itemIdAndPrice of itemsDataStrings) {
                if (itemIdAndPrice != '') {
                    const itemId = itemIdAndPrice.split('^')[0]
                    const itemPrice = itemIdAndPrice.split('^')[1]
                    itemsData.push([+itemId,+itemPrice])
                }
            }
        }

        return itemsData
    }
}