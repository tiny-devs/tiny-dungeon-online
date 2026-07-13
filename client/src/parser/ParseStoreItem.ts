import { ItemsIds } from '../../../shared/Enums'

export class ParseStoreItem {
    public success: boolean
    public message: string
    public itemId: ItemsIds
    public bagCoins: number
    public bankCoins: number
    public amount: number

    constructor(data: string) {
        const pickData = this.parseString(data)

        this.success = pickData[1] === 'true'
        if (this.success) {
            this.message = 'Success'
            this.itemId = +pickData[3]
            this.bagCoins = +pickData[4]
            this.bankCoins = +pickData[5]
            this.amount = pickData[6] !== undefined ? +pickData[6] : 0
        } else {
            this.message = pickData[2]
            this.itemId = 0
            this.bagCoins = 0
            this.bankCoins = 0
            this.amount = 0
        }
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
