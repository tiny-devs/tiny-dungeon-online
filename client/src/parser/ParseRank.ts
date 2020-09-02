export class ParseRank {
  public top1Name: string
  public top1Level: number
  public top2Name: string
  public top2Level: number
  public top3Name: string
  public top3Level: number

  constructor(data: string) {
      const rankData = this.parseString(data)

      this.top1Name = rankData[1]
      this.top1Level = +rankData[2]
      this.top2Name = rankData[3]
      this.top2Level = +rankData[4]
      this.top3Name = rankData[5]
      this.top3Level = +rankData[6]
  }

  private parseString(eventDataString: string) {
      return eventDataString.split(',')
  }
}
