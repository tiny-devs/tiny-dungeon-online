export class ParseMessage {
  public message: string

  constructor(data: string) {
      const message = this.parseString(data)

      this.message = message
  }

  private parseString(eventDataString: string) {
      const indexFirstQuotes = eventDataString.indexOf(',"')+2
      const indexLastQuotes = eventDataString.split(',"')[1].indexOf('"')+indexFirstQuotes
      return eventDataString.substring(indexFirstQuotes, indexLastQuotes)
  }
}