export class ParsePve {
    public attacker: number
    public damageCaused: number
    public npcHp: number
    public npcId: number
    public playerHp: number
    public playerId: string
    public roomId: number
    public playerTargetingNpcId: number

    constructor(data: string) {
        const pveData = this.parseString(data)

        this.attacker = Number(pveData[1])
        this.damageCaused = +pveData[2]
        this.npcHp = +pveData[3]
        this.npcId = Number(pveData[4])
        this.playerHp = +pveData[5]
        this.playerId = pveData[6]
        this.roomId = Number(pveData[7])
        this.playerTargetingNpcId = Number(pveData[8])
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',')
    }
}
