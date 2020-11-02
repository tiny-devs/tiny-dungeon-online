export class ParsePlayerIdUpdate {
    public oldId: string
    public newId: string

    constructor(data: string) {
        const playerIdData = this.parseString(data)

        this.oldId = playerIdData[1]
        this.newId = playerIdData[2]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
