export class ParseItemsInRoom {
    public items: ItemDto[]

    constructor(data: string) {
        this.items = this.parseString(data)
    }

    private parseString(eventDataString: string): ItemDto[]
    {
        const splitted = eventDataString.split(',')
        const npcsInRoomRaw = splitted.slice(2).filter(x => x !== '')
        const npcsInRoomRawMatrix = npcsInRoomRaw.map(x => x.split('@'))
        let npcsInRoomList: ItemDto[] = []
        for (const u of npcsInRoomRawMatrix) {
            npcsInRoomList.push(new ItemDto(
                Number(u[0]),
                Number(u[1]),
                Number(splitted[1]),
                Number(u[2]),
                Number(u[3])))
        }
        
        return npcsInRoomList
    }
}

export class ItemDto {
    constructor(public id: number,
    public itemId: number,
    public roomId: number,
    public x: number,
    public y: number) {
        this.id = id
        this.itemId = itemId
        this.roomId = roomId
        this.x = x
        this.y = y
    }
}