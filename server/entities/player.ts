import { Direction, Rooms, Items } from '../Enums.ts'
import Room from '../map/rooms/room.ts'
import { ClientHandler } from '../clientHandler.ts'
import Bag from './items/bag.ts'
import Gear from './items/gear.ts'

export class Player {
    public id: string
    public name: string
    public color: string
    public x: number
    public y: number
    public matrix: number[][] = []
    public boardRows: number
    public boardColumns: number
    public currentRoomId: number
    public currentRoom: Room
    public hp: number = 10
    public maxHp: number = 10
    public attack: number = 4
    public defense: number = 4
    public level: number = 1
    public xp: number = 0
    public xpNeeded: number = 10
    public bag: Bag = new Bag(this)
    public gear: Gear
    public clientWs: any
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
        this.gear = new Gear(this, clientHandler)
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
                this.pickupAnyItemAtCoords(this.y,this.x)
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
            maxHp: this.totalHp(),
            atk: this.totalAttack(),
            def: this.totalDefense(),
            xpNeed: this.xpNeeded
        }
    }

    public getStats() {
        return {
            hp: this.hp,
            maxHp: this.totalHp(),
            attack: this.totalAttack(),
            defense: this.totalDefense(),
            level: this.level,
            xp: +this.xp.toFixed(2),
            xpNeeded: this.xpNeeded
        }
    }

    public addHp(amount: number) {
        this.hp = ((amount + this.hp) > this.totalHp()) ? this.totalHp() : (amount + this.hp)
    }

    public addXp(amount: number) {
        const isLevelUp = (amount + this.xp) >= this.xpNeeded
        const exceedingXp = isLevelUp ? +((amount + this.xp) - this.xpNeeded).toFixed(2) : 0

        this.xp = isLevelUp ? exceedingXp : (amount + this.xp)
        this.level = isLevelUp ? this.level+1 : this.level
        this.xpNeeded = +((this.level**2)+10).toFixed(2)

        this.clientHandler.unicastPlayerStats(this)
    }

    public takeDamage(dmg: number): number {
        let defense = this.getDefenseFromDamage()
        defense = defense > dmg ? dmg : defense
        const actualDamage = (dmg - defense)
    
        this.hp -= actualDamage < 0 ? 0 : actualDamage
        if (this.hp <= 0) {
            this.hp = this.totalHp()
            this.respawn()
        }

        return defense
    }

    public getAttackDamage(): number {
        return Math.floor(Math.random() * (this.totalAttack()))
    }

    private getDefenseFromDamage(): number {
        return Math.floor(Math.random() * (this.totalDefense()))
    }

    private totalDefense() {
        return this.defense + this.gear.getDefenseBonus() + Math.floor(this.level/5)
    }

    private totalAttack() {
        return this.attack + this.gear.getAttackBonus() + Math.floor(this.level/5)
    }

    private totalHp() {
        return this.maxHp + Math.floor(this.level/5)
    }

    private respawn() {
        this.currentRoomId = Rooms.Initial
        this.x = 0
        this.y = 0
        this.clientHandler.broadcastPlayerMove(this, Direction.Right)
        this.clientHandler.unicastPlayerStats(this)
    }

    private notCollided(y: number, x: number): boolean {        
        const notSolidTile = this.currentRoom.solidLayer[y][x] === 0
        const notNpc = !this.hasNpc(y,x)

        return notSolidTile && notNpc
    }

    private hasNpc(y: number, x: number) {
        return this.currentRoom.npcs.some(npc => npc.x == x && npc.y == y)
    }

    private pickupAnyItemAtCoords(y: number, x: number): boolean {
        const item = this.currentRoom.itemsLayer[y][x]
        if (item) {
            const gotItem = this.bag.addItem(item)
            if (gotItem) {
                this.currentRoom.removeItem(y,x,this.id)
                return true
            }
        }
        return false
    }

    private delayMove(): void {
        this.canMove = false;
        setTimeout(() => { this.canMove = true; }, 100);
    }
}