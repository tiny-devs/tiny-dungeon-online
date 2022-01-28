export class ParsePlayersInRoom {
    public roomId: number
    public playersInRoom: { id: string, x: number, y: number }[]

    constructor(data: string) {
        const playersData = this.parseString(data)

        this.roomId = +playersData[1]
        this.playersInRoom = JSON.parse(playersData[2])
    }

    private parseString(eventDataString: string) {
        let rawDataString = eventDataString
        let matrix = ''
        rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['))
        matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length)

        let eventData = rawDataString.split(',')
        eventData.push(matrix)

        return eventData
    }
}
