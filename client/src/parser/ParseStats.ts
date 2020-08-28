export class ParseStats {
    public hp: number
    public maxHp: number
    public attack: number
    public defense: number
    public level: number
    public xp: number
    public xpNeeded: number

    constructor(data: string) {
        const parsedData = this.parseString(data)

        this.hp = +parsedData[1]
        this.maxHp = +parsedData[2]
        this.attack = +parsedData[3]
        this.defense = +parsedData[4]
        this.level = +parsedData[5]
        this.xp = +parsedData[6]
        this.xpNeeded = +parsedData[7]
    }

    private parseString(eventDataString: string): string[] {
        const statsData = eventDataString.split(',')

        return statsData
    }
}