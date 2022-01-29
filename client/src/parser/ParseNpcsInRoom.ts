export class ParseNpcsInRoom {
    public npcs: NpcDto[]

    constructor(data: string) {
        this.npcs = this.parseString(data)
    }

    private parseString(eventDataString: string): NpcDto[]
    {
        const splitted = eventDataString.split(',')
        const npcsInRoomRaw = splitted.slice(1).filter(x => x !== '')
        const npcsInRoomRawMatrix = npcsInRoomRaw.map(x => x.split('@'))
        let npcsInRoomList: NpcDto[] = []
        for (const u of npcsInRoomRawMatrix) {
            npcsInRoomList.push(new NpcDto(
                Number(u[0]),
                Number(u[1]),
                Number(u[2]),
                Number(u[3]),
                Number(u[4]),
                Number(u[5]),
                Number(u[6])))
        }
        
        return npcsInRoomList
    }
}

export class NpcDto {
    constructor(public id: number,
    public npcId: number,
    public x: number,
    public y: number,
    public roomId: number,
    public hp: number,
    public maxHp: number) {
        this.id = id
        this.npcId = npcId
        this.roomId = roomId
        this.x = x
        this.y = y
        this.hp = hp
        this.maxHp = maxHp
    }
}