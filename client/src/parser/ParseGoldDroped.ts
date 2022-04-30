export class ParseGoldDroped {
    public amount: number

    constructor(data: string) {
        const dropedData = this.parseString(data)

        this.amount = +dropedData[1]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
