export class ParseError {
    public message: string

    constructor(data: string) {
        const errorData = this.parseString(data)

        this.message = errorData[1]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
