import { ItemsIds } from "../models/Enums"

export class ParseItemsInRoom {
    public items: ItemsDto[]

    constructor(data: string) {
        this.items = this.parseString(data)
    }

    private parseString(eventDataString: string): ItemsDto[] {
        let list = []
        let listString = ''
        let rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['))
        let roomIdString = rawDataString.split(',')
        let roomId = +roomIdString[1]

        listString = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length)
        let items = JSON.parse(listString)

        for (const item of items) {
            list.push(new ItemsDto(item.id, item.itemId, roomId, item.x, item.y))
        }

        return list
    }
}

class ItemsDto {
    public id: number
    public itemId: ItemsIds
    public roomId: number
    public x: number
    public y: number

    constructor(id: number, itemId: ItemsIds, roomId: number, x: number, y: number) {
        this.id = id
        this.itemId = itemId
        this.roomId = roomId
        this.x = x
        this.y = y
    }
}