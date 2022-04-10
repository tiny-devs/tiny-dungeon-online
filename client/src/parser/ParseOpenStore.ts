export class ParseOpenStore {
  public merchantId: number

  constructor(data: string) {
    const merchantData = this.parseString(data)

    this.merchantId = Number(merchantData[1])
  }

  private parseString(eventDataString: string) {
    return eventDataString.split(',')
  }
}
