import { ItemsIds } from "../models/Enums"

export class ParseItemUse {
    public itemId: ItemsIds
    public stats: StatsDto

    constructor(data: string) {
        const parsedData = this.parseString(data)

        this.itemId = parsedData[0]
        this.stats = parsedData[1]
    }

    private parseString(eventDataString: string): any[] {
        let data = []
        let itemIdString = eventDataString.split(',')
        let itemId = +itemIdString[1]
        let statsString = ''
        statsString = eventDataString.substr(eventDataString.indexOf('{'), eventDataString.length)
        let stats = JSON.parse(statsString)

        data.push(itemId)
        data.push(new StatsDto(stats.hp, stats.maxHp, stats.attack, stats.defense))

        return data
    }
}

class StatsDto {
    public hp: number
    public maxHp: number
    public attack: number
    public defense: number

    constructor(hp: number, maxHp: number, attack: number, defense: number) {
        this.hp = hp
        this.maxHp = maxHp
        this.attack = attack
        this.defense = defense
    }
}