export class ParsePlayersInRoom {
    public roomId: number
    public playersInRoom: { id: string, x: number, y: number }[]

    constructor(data: string) {
        const playersData = this.parseString(data)

        this.roomId = +playersData[0]
        this.playersInRoom = playersData[1]
    }

    private parseString(eventDataString: string): any[] {
        const returnList = []
        const splitted = eventDataString.split(',')
        const playersInRoomRaw = splitted.slice(2).filter(x => x !== '')
        const playersInRoomRawMatrix = playersInRoomRaw.map(x => x.split('@'))
        let playersInRoomList: { id: string, x: number, y: number }[] = []
        for (const u of playersInRoomRawMatrix) {
            playersInRoomList.push({
                id: u[0],
                x: +u[1],
                y: +u[2]
            })
        }
        
        returnList.push(splitted[1])
        returnList.push(playersInRoomList)
        
        return returnList
    }
}
