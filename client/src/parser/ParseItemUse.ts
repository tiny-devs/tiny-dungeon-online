export class ParseItemUse {
    public stats: StatsDto

    constructor(data: string) {
        this.stats = this.parseString(data)
    }

    private parseString(eventDataString: string): StatsDto {
        let statsString = ''
        statsString = eventDataString.substr(eventDataString.indexOf('{'), eventDataString.length)
        let stats = JSON.parse(statsString)

        return new StatsDto(stats.hp, stats.maxHp, stats.attack, stats.defense)
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