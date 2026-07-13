import { ItemsIds } from '../../../shared/Enums'

export class ParseOpenBank {
  public bankerNpcId: number
  public bankCoins: number
  public itemIds: ItemsIds[]

  constructor(data: string) {
    const parsed = this.parseString(data)

    this.bankerNpcId = parsed.bankerNpcId
    this.bankCoins = parsed.bankCoins
    this.itemIds = parsed.itemIds
  }

  private parseString(eventDataString: string): { bankerNpcId: number, bankCoins: number, itemIds: ItemsIds[] } {
    const allData = eventDataString.split('@')
    const header = allData[0].split(',')
    const bankerNpcId = Number(header[1])
    const bankCoins = Number(allData[1] || 0)

    const itemIds: ItemsIds[] = []
    if (allData[2]) {
      const itemsDataStrings = allData[2].split(',')
      for (const itemId of itemsDataStrings) {
        if (itemId != '') {
          itemIds.push(+itemId)
        }
      }
    }

    return { bankerNpcId, bankCoins, itemIds }
  }
}
