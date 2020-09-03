export class ParseDialog {
  public message: string

  constructor(data: string) {
      const dialogData = this.parseString(data)

      this.message = dialogData
  }

  private parseString(eventDataString: string) {
      const indexFirstQuotes = eventDataString.indexOf(',"')+2
      const indexLastQuotes = eventDataString.split(',"')[1].indexOf('"')+indexFirstQuotes
      return eventDataString.substring(indexFirstQuotes, indexLastQuotes)
  }
}