export class ParseSave {
    public playerDataHex: string

    constructor(data: string) {
        const saveData = this.parseString(data)

        this.playerDataHex = saveData[1]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
