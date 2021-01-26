import { Direction, Rooms, Items, Npcs } from '../Enums.ts'
import Room from '../map/rooms/room.ts'
import { ClientHandler } from '../clientHandler.ts'
import Bag from './items/bag.ts'
import Gear from './items/gear.ts'
import { WebSocket } from 'https://deno.land/std@0.77.0/ws/mod.ts'
import Quest from './npcs/quests/quest.ts'
import QuestBase from "./npcs/quests/questBase.ts"
import ItemBase from "./items/itemBase.ts"
import { Admins } from "../data/admins.ts"
import { ItemsToHave } from "./npcs/quests/itemsToHave.ts"

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
    public fightingNpcId: null | number = null
    public hp: number = 10
    public maxHp: number = 10
    public attack: number = 4
    public defense: number = 4
    public level: number = 1
    public xp: number = 0
    public xpNeeded: number = 10
    public bag: Bag = new Bag(this)
    public gear: Gear
    public quests: Quest[] = []
    public chatTimeout: number = 5000
    public badBehaviour: number = 0
    public canChat: boolean = true
    public clientWs: WebSocket
    private afkTimeout: number = 0
    private afkTotalSeconds: number = 601 // 10:01 min
    private currentAfkSecondsLeft: number = 601
    private canMove: boolean = true
    private savePlayerInterval: number = 300000 // 5 min
    private playerSaveTimeout: number = 0
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
        this.afkTimer()
    }

    public move(key: Direction): boolean {
        this.currentAfkSecondsLeft = this.afkTotalSeconds
        let validMove = false

        if (this.canMove) {
            switch (key) {
                case Direction.Right:
                    if (this.x + 1 < this.boardRows) {
                        if (this.notCollided(this.y,this.x + 1)) {
                            this.x++
                            validMove = true
                        } else if (this.hasNpc(this.y,this.x + 1)) {
                            const npc = this.getNpc(this.y,this.x + 1)
                            npc!.talkTo(this)
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
                        } else if (this.hasNpc(this.y + 1,this.x)) {
                            const npc = this.getNpc(this.y + 1,this.x)
                            npc!.talkTo(this)
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
                        } else if (this.hasNpc(this.y,this.x - 1)) {
                            const npc = this.getNpc(this.y,this.x - 1)
                            npc!.talkTo(this)
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
                        } else if (this.hasNpc(this.y - 1,this.x)) {
                            const npc = this.getNpc(this.y - 1,this.x)
                            npc!.talkTo(this)
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
                if (this.changedRoom()){
                    this.fightingNpcId = null
                }
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

    public getPlayerDataForSave(): string {
        const hashVersion = 1
        let simpleData = `${hashVersion}@${this.id};${this.name};${this.level};${+this.xp.toFixed(2)};${this.xpNeeded};` +
                    `${this.hp};${this.maxHp};${this.attack};${this.defense}@`
        
        let bagData = `${this.bag.coins}`
        for (const item of this.bag.items) {
            bagData += `;${item.itemId}`
        }

        let gearData = `@`
        if (this.gear.head) {
            gearData += `${this.gear.head.itemId},`
        } else {
            gearData += 'empty,'
        }
        if (this.gear.torso) {
            gearData += `${this.gear.torso.itemId},`
        } else {
            gearData += 'empty,'
        }
        if (this.gear.legs) {
            gearData += `${this.gear.legs.itemId},`
        } else {
            gearData += 'empty,'
        }
        if (this.gear.weapon) {
            gearData += `${this.gear.weapon.itemId}`
        } else {
            gearData += 'empty'
        }

        //let questData = `[` maybe later

        return simpleData + bagData + gearData
    }

    public loadPlayerDataFromSave(data: string): boolean {
        if (data.length < 10) {
            console.log('unable to read player data')
            return false;
        }

        try {
            const allData = data.split('@')
            const simpleData = allData[1].split(';')
            this.id = simpleData[0]
            //this.name = simpleData[1]
            this.level = +simpleData[2]
            this.xp = +simpleData[3]
            this.xpNeeded = +simpleData[4]
            this.hp = +simpleData[5]
            this.maxHp = +simpleData[6]
            this.attack = +simpleData[7]
            this.defense = +simpleData[8]
    
            const bagData = allData[2].split(';')
            this.bag.coins = +bagData[0]
            if (bagData[1]) {
                for (let i=1;i<bagData.length;i++) {
                    const item = this.bag.getItemFromItemId(+bagData[i])
                    if (item) {
                        this.bag.addItem(item)
                    }
                }
            }
    
            const gearData = allData[3].split(',')
            for (let i=0; i<4; i++) {
                if (!gearData[i].includes('empty')) {
                    const item = this.bag.getItemFromItemId(+gearData[i])
                    if (item) {
                        this.gear.wear(item, true)
                    }
                }
            }
    
            return true
        } catch (e) {
            return false
        }
    }

    public savePlayer(): void {
        clearTimeout(this.playerSaveTimeout)
        if (!this.clientWs.isClosed) {
            this.playerSaveTimeout = setTimeout(async () => {
                this.clientHandler.unicastPlayerDataHashSave(this).then(() => {
                    this.savePlayer()
                })
            }, this.savePlayerInterval);
        }
    }

    public startChatTimeout() {
        this.canChat = false
        setTimeout(async () => {
            this.canChat = true
        }, this.chatTimeout);
    }

    public getNewQuest(quest: QuestBase){
        const alreadyHasQuest = this.quests.some(q => q.id == quest.id)
        if (!alreadyHasQuest) {
            this.quests.push(new Quest(quest))
        }
    }

    public checkNpcKillForQuest(npcId: Npcs) {
        for (const quest of this.quests) {
            quest.checkMonsterKill(npcId, this)
        }
    }

    public getItemFromQuest(item: ItemBase): boolean {
        if (item) {
            const gotItem = this.bag.addItem(item)
            if (gotItem) {
                this.clientHandler.roomcastItemPick(this.currentRoomId,-1,-1,item.itemId,item.coins,this.id)
                this.clientHandler.unicastPlayerDataHashSave(this)
                return true
            }
        }
        return false
    }

    public removeItemsFromQuest(items: ItemsToHave[]): boolean {
        if (items) {
            for (const itemToHave of items) {
                for (let i=0;i<itemToHave.amountTotal;i++) {
                    this.bag.removeItemFromQuest(itemToHave.item)
                }
            }
            this.clientHandler.unicastPlayerBag(this)
        }
        return true
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
        if (isLevelUp) {
            this.clientHandler.updateRank()
            for (const quest of this.quests) {
                quest.checkLevelToReach(this)
            }
        }
    }

    public takeDamage(dmg: number, crit: boolean): number {
        let defense = this.getDefenseFromDamage(crit)
        defense = defense > dmg ? dmg : defense
        const actualDamage = (dmg - defense)
    
        this.hp -= actualDamage < 0 ? 0 : actualDamage
        if (this.hp <= 0) {
            this.hp = this.totalHp()
            this.respawn()
        }

        return defense
    }

    public checkCriticalHit(hit: number): boolean {
        return hit > (this.totalAttack() - (this.totalAttack()/8))
    }

    public getAttackDamage(): number {
        const luckFactor = Math.random()
        if (luckFactor > 0.9) {
            return this.totalAttack()
        }
        return Math.floor(luckFactor * (this.totalAttack()))
    }

    private getDefenseFromDamage(crit: boolean): number {
        const minimalDefenseFromBadLuck = 0.5 // defense can be halved from bad luck
        let luckFactor = Math.random() * (1 - minimalDefenseFromBadLuck) + minimalDefenseFromBadLuck
        if (luckFactor > 0.9) {
            return this.totalDefense()
        }
        if ((luckFactor < (minimalDefenseFromBadLuck + (luckFactor/2))) && crit) { // if enemy hit critical and you were unlucky defending
            luckFactor = Math.random() * (minimalDefenseFromBadLuck - 0.2) + 0.2 // you defense can be only 20% to 50% effective
        }
        return Math.floor(luckFactor * (this.totalDefense()))
    }

    public totalDefense() {
        return this.defense + this.gear.getDefenseBonus() + Math.floor(this.level/5)
    }

    public totalAttack() {
        return this.attack + this.gear.getAttackBonus() + Math.floor(this.level/5)
    }

    public totalHp() {
        return this.maxHp + this.level - 1
    }

    public teleport(roomId: Rooms) {
        const isAdmin = Admins.some(a => a.name == this.name)
        if (isAdmin) {
            this.fightingNpcId = null
            this.currentRoomId = roomId
            this.x = 0
            this.y = 0
            this.clientHandler.broadcastPlayerMove(this, Direction.Right)
        }
    }

    public spawnItem(itemId: Items): boolean {
        const isAdmin = Admins.some(a => a.name == this.name)
        if (isAdmin) {
            if (itemId) {
                const item = this.bag.getItemFromItemId(itemId)
                if (item) {
                    const gotItem = this.bag.addItem(item)
                    if (gotItem) {
                        this.clientHandler.roomcastItemPick(this.currentRoomId,-1,-1,item.itemId,item.coins,this.id)
                        return true
                    }
                }
            }
        }
        
        return false
    }

    private respawn() {
        this.fightingNpcId = null
        this.currentRoomId = Rooms.InitialRoom
        this.x = 0
        this.y = 0
        this.clientHandler.broadcastPlayerMove(this, Direction.Right)
        this.clientHandler.unicastPlayerStats(this)
    }

    private notCollided(y: number, x: number): boolean {        
        const notSolidTile = this.currentRoom.solidLayer[y][x] === 0 || this.currentRoom.solidLayer[y][x] === -1
        const notNpc = !this.hasNpc(y,x)

        return notSolidTile && notNpc
    }

    private hasNpc(y: number, x: number) {
        return this.currentRoom.npcs.some(npc => npc.x == x && npc.y == y)
    }

    private getNpc(y: number, x: number) {
        return this.currentRoom.npcs.find(npc => npc.x == x && npc.y == y)
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

    private afkTimer(): void {
        if (!this.clientWs.isClosed) {
            this.afkTimeout = setTimeout(async () => {
                if (this.currentAfkSecondsLeft <= 0) {
                    this.clientHandler.kickPlayer(this.name, 'kicked for being afk')
                    clearTimeout(this.afkTimeout)
                } else {
                    this.currentAfkSecondsLeft-=1
                    this.afkTimer()
                }
            }, 1000);
        }
    }

    private delayMove(): void {
        this.canMove = false;
        setTimeout(() => { this.canMove = true; }, 100);
    }
}