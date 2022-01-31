export class ParseMove {
    public playerMovedId: string
    public movedX: number
    public movedY: number
    public currentMovedRoomId: number

    constructor(data: string) {
        const moveData = this.parseString(data)

        this.playerMovedId = moveData[1]
        this.movedX = +moveData[2]
        this.movedY = +moveData[3]
        this.currentMovedRoomId = +moveData[4]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
