export class ParseChat {
  public message: string
  public playerId: string

  constructor(data: string) {
      const chatData = this.parseString(data)

      this.playerId = chatData[0]
      this.message = chatData[1]
  }

  private parseString(eventDataString: string) {
      const indexFirstQuotes = eventDataString.indexOf(',"')+2
      const playerId = eventDataString.split(',')[1]
      const indexLastQuotes = eventDataString.split(',"')[1].indexOf('"')+indexFirstQuotes
      const returnData = [playerId, eventDataString.substring(indexFirstQuotes, indexLastQuotes)]
      return returnData
  }
}