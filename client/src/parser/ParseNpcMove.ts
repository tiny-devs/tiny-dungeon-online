export class ParseNpcMove {
    public id: number
    public npcId: number
    public x: number
    public y: number
    public roomId: number

    constructor(data: string) {
        const moveData = this.parseString(data)

        this.id = +moveData[1]
        this.npcId = +moveData[2]
        this.x = +moveData[3]
        this.y = +moveData[4]
        this.roomId = +moveData[5]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
