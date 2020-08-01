export class ParseMove {
    public playerId: string
    public currentRoomId: number
    public x: number
    public y: number

    constructor(data: string) {
        const moveData = this.parseString(data)

        this.playerId = moveData[1]
        this.currentRoomId = +moveData[4]
        this.x = +moveData[2]
        this.y = +moveData[3]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
