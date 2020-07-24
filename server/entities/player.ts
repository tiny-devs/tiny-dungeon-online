import { Direction, Rooms } from '../Enums.ts'
import Room from '../map/rooms/room.ts'
import { ClientHandler } from '../clientHandler.ts'

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
    public hp: number = 10
    public maxHp: number = 10
    public attack: number = 5
    public defense: number = 5
    private canMove: boolean = true
    private clientHandler: ClientHandler

    constructor(id: string,
        name: string,
        color: string,
        x: number, y: number,
        currentRoom: Room,
        boardRows: number,
        boardColumns: number,
        clientWs: any,
        clientHandler: ClientHandler) {
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
        this.clientHandler = clientHandler
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
            hp: this.hp,
            maxHp: this.maxHp
        }
    }

    public takeDamage(dmg: number): number {
        let defense = this.getDefenseFromDamage()
        defense = defense > dmg ? dmg : defense
        const actualDamage = (dmg - defense)
    
        this.hp-= actualDamage < 0 ? 0 : actualDamage
        if (this.hp <= 0) {
            this.hp = this.maxHp
            this.respawn()
        }

        return defense
    }

    public getAttackDamage(): number {
        return Math.floor(Math.random() * (this.attack))
    }

    private getDefenseFromDamage(): number {
        return Math.floor(Math.random() * (this.defense))
    }

    private respawn() {
        this.currentRoomId = Rooms.Initial
        this.x = 0
        this.y = 0
        this.clientHandler.broadcastPlayerMove(this, Direction.Right)
    }

    private notCollided(y: number, x: number): boolean {
        const notSolidTile = this.currentRoom.solidLayer[y][x] === 0
        const notNpc = !this.hasNpc(y,x)

        return notSolidTile && notNpc
    }

    private hasNpc(y: number, x: number) {
        return this.currentRoom.npcs.some(npc => npc.x == x && npc.y == y)
    }

    private delayMove(): void {
        this.canMove = false;
        setTimeout(() => { this.canMove = true; }, 100);
    }
}