export class ParseNpcsInRoom {
    public npcs: any

    constructor(data: string) {
        const npcsInRoom = this.parseString(data)

        this.npcs = JSON.parse(npcsInRoom[1])
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
