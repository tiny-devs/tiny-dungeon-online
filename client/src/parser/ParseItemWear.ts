import { ItemsIds, GearType } from "../models/Enums"

export class ParseItemWear {
    public itemId: ItemsIds
    public gearType: GearType

    constructor(data: string) {
        const wearData = this.parseString(data)

        this.itemId = +wearData[1]
        this.gearType = +wearData[2]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
