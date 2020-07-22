import { Direction } from '../Enums.ts'
import Room from '../map/rooms/room.ts'

export class Player {
    public id: string
    public name: string
    public color: string
    public x: number
    public y: number
    public matrix: number[][] = []
    public currentRoomId: number
    public currentRoom: Room
    public clientWs: any
    public boardRows: number
    public boardColumns: number
    public hp: number = 100
    private canMove: boolean = true

    constructor(id: string,
        name: string,
        color: string,
        x: number, y: number,
        currentRoom: Room,
        boardRows: number,
        boardColumns: number,
        clientWs: any) {
        this.id = id
        this.name = name
        this.color = color
        this.x = x
        this.y = y
        this.currentRoomId = currentRoom.id
        this.currentRoom = currentRoom
        this.boardRows = boardRows
        this.boardColumns = boardColumns
        this.clientWs = clientWs
    }

    public move(key: Direction): boolean {
        let validMove = false

        if (this.canMove) {
            switch (key) {
                case Direction.Right:
                    if (this.x + 1 < this.boardRows) {
                        if (this.notCollided(this.y,this.x + 1)) {
                            this.x++
                            validMove = true
                        }
                    } else {
                        const result = this.currentRoom.goEast()
                        if (result.valid) {
                            this.currentRoomId = result.roomId
                            this.x = 0
                            validMove = true
                        }
                    }
                    break;
                case Direction.Down:
                    if (this.y + 1 < this.boardColumns) {
                        if (this.notCollided(this.y + 1,this.x)) {
                            this.y++
                            validMove = true
                        }
                    } else {
                        const result = this.currentRoom.goSouth()
                        if (result.valid) {
                            this.currentRoomId = result.roomId
                            this.y = 0
                            validMove = true
                        }
                    }
                    break;
                case Direction.Left:
                    if (this.x - 1 >= 0) {
                        if (this.notCollided(this.y,this.x - 1)) {
                            this.x--
                            validMove = true
                        }
                    } else {
                        const result = this.currentRoom.goWest()
                        if (result.valid) {
                            this.currentRoomId = result.roomId
                            this.x = this.boardRows - 1
                            validMove = true
                        }
                    }
                    break;
                case Direction.Up:
                    if (this.y - 1 >= 0) {
                        if (this.notCollided(this.y - 1,this.x)) {
                            this.y--
                            validMove = true
                        }
                    } else {
                        const result = this.currentRoom.goNorth()
                        if (result.valid) {
                            this.currentRoomId = result.roomId
                            this.y = this.boardColumns - 1
                            validMove = true
                        }
                    }
                    break;
            }

            if (validMove) {
                this.delayMove()
            }
        }

        return validMove
    }

    public changedRoom(): boolean {
        return this.currentRoomId != this.currentRoom.id
    }

    public getReturnData() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            x: this.x,
            y: this.y,
            matrix: this.matrix,
            currentRoomId: this.currentRoomId,
            hp: this.hp
        }
    }

    private notCollided(y: number, x: number): boolean {
        const notSolidTile = this.currentRoom.solidLayer[y][x] === 0
        const notNpc = !this.currentRoom.npcs.some(npc => npc.x == x && npc.y == y)

        return notSolidTile && notNpc
    }

    private delayMove(): void {
        this.canMove = false;
        setTimeout(() => { this.canMove = true; }, 100);
    }
}