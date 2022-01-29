export class ParseLogin {
    public playerId: string
    public serverRules: { boardRows: number; boardColumns: number }
    public players: PlayerDto[]

    constructor(data: string) {
        const loginData = this.parseString(data)

        this.playerId = loginData[0]
        this.serverRules = {
            boardRows: loginData[1],
            boardColumns: loginData[2],
        }
        this.players = loginData[3]
    }

    private parseString(eventDataString: string): [string, number, number, PlayerDto[]]
    {
        const splitted = eventDataString.split('$')
        const playersRaw = splitted.slice(3).filter(x => x !== '')
        const playersRawMatrix = playersRaw.map(x => x.split('@'))
        let playersList: PlayerDto[] = []
        for (const u of playersRawMatrix) {
            playersList.push(new PlayerDto(
                u[0],
                u[1],
                u[2],
                Number(u[3]),
                Number(u[4]),
                Number(u[5]),
                Number(u[6]),
                Number(u[7]),
                Number(u[8]),
                Number(u[9]),
                Number(u[10]),
                u[11]))
        }
        
        return [splitted[0].split(',')[1], Number(splitted[1]), Number(splitted[2]), playersList]
    }
}

export class PlayerDto {
    constructor(public id: string,
    public name: string,
    public color: string,
    public x: number,
    public y: number,
    public currentRoomId: number,
    public hp: number,
    public maxHp: number,
    public atk: number,
    public def: number,
    public xpNeed: number,
    public matrix: any) {
        this.id = id
        this.name = name
        this.color = color
        this.x = x
        this.y = y
        this.currentRoomId = currentRoomId
        this.hp = hp
        this.maxHp = maxHp
        this.atk = atk
        this.def = def
        this.xpNeed = xpNeed
        this.matrix = JSON.parse(matrix)
    }
}