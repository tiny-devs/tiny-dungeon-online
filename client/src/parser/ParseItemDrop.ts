import { ItemsIds } from '../../../shared/Enums'

export class ParseItemDrop {
    public id: number
    public itemId: ItemsIds
    public roomId: number
    public x: number
    public y: number

    constructor(data: string) {
        const dropData = this.parseString(data)

        this.id = +dropData[1]
        this.itemId = +dropData[2]
        this.roomId = +dropData[3]
        this.x = +dropData[4]
        this.y = +dropData[5]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
