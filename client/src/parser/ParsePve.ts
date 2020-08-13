export class ParsePve {
    public attacker: string
    public damageCaused: number
    public npcHp: number
    public npcId: string
    public playerHp: number
    public playerId: string
    public roomId: string

    constructor(data: string) {
        const pveData = this.parseString(data)

        this.attacker = pveData[1]
        this.damageCaused = +pveData[2]
        this.npcHp = +pveData[3]
        this.npcId = pveData[4]
        this.playerHp = +pveData[5]
        this.playerId = pveData[6]
        this.roomId = pveData[7]
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
