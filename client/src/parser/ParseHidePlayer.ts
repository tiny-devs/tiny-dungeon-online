export class ParseHidePlayer {
    public playerId: string
    public roomId: number

    constructor(data: string) {
        const hideData = this.parseString(data)

        this.playerId = hideData[1]
        this.roomId = +hideData[2]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
