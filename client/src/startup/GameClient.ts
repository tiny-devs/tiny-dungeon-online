import { PlayerConfig } from '../models/configs'
import { Game } from './Game'
import { Main } from './Main'
import { Parser } from '../parser/Parser'
import { Command, PveAttacker, Rooms, Direction, ItemsIds, GearType } from '../models/Enums'
import { Color, PlayerColors } from '../board/map/tiles/Color'
import Bag from '../entities/items/Bag'
import { ParseItemPick } from '../parser/ParseItemPick'
import { ParseItemRemove } from '../parser/ParseItemRemove'
import Gear from '../entities/items/Gear'
import { ParseRank } from '../parser/ParseRank'
import { ParseLoad } from '../parser/ParseLoad'
import { ParsePlayerIdUpdate } from '../parser/ParsePlayerIdUpdate'
import { ParseLoadBag } from '../parser/ParseLoadBag'
import { ParseEntityInfo } from '../parser/ParseEntityInfo'
import IconCanvas from '../entities/items/IconCanvas'
import TinyIcon from '../models/configs/ClientConfig'

export class GameClient {
    public loggedIn: boolean
    public playerName: string
    public playerId: string
    public bag: Bag
    public gear: Gear
    public currentRoomId: Rooms
    public game: Game
    
    private loginScreen: HTMLElement
    private gameScreen: HTMLElement
    private bagElement: HTMLElement
    private gearElement: HTMLElement
    private exitElement: HTMLElement
    private exit: HTMLElement
    private coinsElement: HTMLElement
    private hpTextElement: HTMLElement
    private xpTextElement: HTMLElement
    private hpBarElement: HTMLElement
    private xpBarElement: HTMLElement
    private atkTextElement: HTMLElement
    private defTextElement: HTMLElement
    private messageElement: HTMLElement
    private chatElement: HTMLElement
    private chatMessageElement: HTMLInputElement
    private chatBtn: HTMLButtonElement
    private showRankBtn: HTMLButtonElement
    private showPlayersBtn: HTMLButtonElement
    private showEntityInfoBtn: HTMLButtonElement
    private rankElement: HTMLElement
    private playersElement: HTMLElement
    private entityInfoElement: HTMLElement
    public nameInfoElement: HTMLElement
    public levelInfoElement: HTMLElement
    public maxHpInfoElement: HTMLElement
    public itemsInfoElement: HTMLElement
    private top1Element: HTMLElement
    private top2Element: HTMLElement
    private top3Element: HTMLElement
    public loadingElement: HTMLElement
    private isShowingMessage: boolean
    private messageTimeout: number
    private up: HTMLElement
    private down: HTMLElement
    private left: HTMLElement
    private right: HTMLElement
    private isMobile: boolean
    private mobileDirection: number = 0
    private mobileCanMove: boolean = false
    private movementTimeout : number = 0
    private isShowingRank: boolean
    private isShowingPlayerList: boolean
    private isShowingEntityInfo: boolean
    private ws: WebSocket | null
    private playerMatrix: number[][]
    private parser: Parser
    private currentRoom: any
    private canMove: boolean
    private keys: any = {}
    private chatTimeout: number = 5
    private canChat: boolean = true
    private isTyping: boolean = false
    private localStorageLoadKey: string = 'tinydata'
    private adminPassword: string = ''
    private afkTimeout: number = 0
    private afkInterval: number = 240000 // 4min
    private afkTabMinCountdown: number = 9
    private afkTabSecCountdown: number = 59

    constructor(game: Game, clientConfigs: PlayerConfig, mainElements: Main) {
        document.onkeydown = this.setKeyPressed.bind(this)
        document.onkeyup = (e) => this.keys[`${e.keyCode}`] = false
        this.loginScreen = mainElements.loginScreen
        this.gameScreen = mainElements.gameScreen
        this.bagElement = mainElements.bagElement
        this.coinsElement = mainElements.coinsElement
        this.gearElement = mainElements.gearElement
        this.exitElement = mainElements.exitElement
        this.hpTextElement = mainElements.hpTextElement
        this.xpTextElement = mainElements.xpTextElement
        this.hpBarElement = mainElements.hpBarElement
        this.xpBarElement = mainElements.xpBarElement
        this.atkTextElement = mainElements.atkTextElement
        this.defTextElement = mainElements.defTextElement
        this.messageElement = mainElements.messageElement
        this.chatElement = mainElements.chatElement
        this.chatMessageElement = mainElements.chatMessageElement as HTMLInputElement
        this.exit = mainElements.exitBtn as HTMLInputElement
        this.rankElement = mainElements.rankElement
        this.playersElement = mainElements.playersElement
        this.entityInfoElement = mainElements.entityInfoElement
        this.nameInfoElement = mainElements.nameInfoElement
        this.levelInfoElement = mainElements.levelInfoElement
        this.maxHpInfoElement = mainElements.maxHpInfoElement
        this.itemsInfoElement = mainElements.itemsInfoElement
        this.top1Element = mainElements.top1Element
        this.top2Element = mainElements.top2Element
        this.top3Element = mainElements.top3Element
        this.loadingElement = mainElements.loadingElement
        this.isShowingMessage = false
        this.messageTimeout = 0
        this.adminPassword = mainElements.adminPassword

        this.gameScreen.onclick = () => this.sendEntityInfo()
        
        this.up = mainElements.mobileUp
        this.up.onclick = () => {
            this.checkKey({ keyCode: 38 })
        }
        this.up.ontouchstart = () => {
            this.mobileDirection = 38
            this.mobileCanMove = true
        }
        this.up.ontouchend = () => {
            this.mobileCanMove = false
        }
        this.down = mainElements.mobileDown
        this.down.onclick = () => {
            this.checkKey({ keyCode: 40 })
        }
        this.down.ontouchstart = () => {
            this.mobileDirection = 40
            this.mobileCanMove = true
        }
        this.down.ontouchend = () => {
            this.mobileCanMove = false
        }
        this.left = mainElements.mobileLeft
        this.left.onclick = () => {
            this.checkKey({ keyCode: 37 })
        }
        this.left.ontouchstart = () => {
            this.mobileDirection = 37
            this.mobileCanMove = true
        }
        this.left.ontouchend = () => {
            this.mobileCanMove = false
        }
        this.right = mainElements.mobileRight
        this.right.onclick = () => {
            this.checkKey({ keyCode: 39 })
        }
        this.right.ontouchstart = () => {
            this.mobileDirection = 39
            this.mobileCanMove = true
        }
        this.right.ontouchend = () => {
            this.mobileCanMove = false
        }

        this.isShowingRank = false
        this.showRankBtn = mainElements.showRankBtn
        this.showRankBtn.onclick = () => {
            this.toggleRank()
        }
        this.isShowingPlayerList = false
        this.showPlayersBtn = mainElements.showPlayersBtn
        this.showPlayersBtn.onclick = () => {
            this.togglePlayers()
        }
        this.isShowingEntityInfo = false
        this.showEntityInfoBtn = mainElements.showEntityInfoBtn
        this.showEntityInfoBtn.onclick = () => {
            this.toggleEntityInfo()
        }

        this.exit = mainElements.exitBtn as HTMLButtonElement
        this.exit.onclick = () => {
            this.sendExitRequest()
        }

        this.chatBtn = mainElements.chatBtn as HTMLButtonElement
        this.chatBtn.onclick = () => {
            this.sendChat()
        }

        this.chatMessageElement.oninput = () => {
            this.isTyping = true
            if (this.chatMessageElement.value.length > 40) {
                this.chatMessageElement.value = this.chatMessageElement.value.substring(0, 40)
            }
        }
        this.chatMessageElement.onkeydown = (e: Partial<KeyboardEvent>) => {
            e = e || window.event;
            if (e.keyCode == 13) {
                this.sendChat()
            }
        }
        this.chatMessageElement.onblur = () => {
            this.isTyping = false
        }
        this.chatMessageElement.onfocus = () => {
            this.isTyping = true
        }
        
        this.checkMovement()
        this.showStatusOnTab()

        this.game = game
        this.ws = null
        this.loggedIn = false
        this.playerName = clientConfigs.playerName
        this.playerId = ''
        this.bag = new Bag(this)
        this.gear = new Gear(this)
        this.currentRoomId = Rooms.InitialRoom
        this.playerMatrix = clientConfigs.playerMatrix
        this.parser = new Parser(this)
        this.currentRoom = this.game.map.rooms[0]
        this.canMove = true
        this.isMobile = mainElements.isMobile()

        this.setupWebSocket()
    }

    setupWebSocket() {
        let socketProtocol = 'wss'
        if (location.protocol !== 'https:') {
            socketProtocol = 'ws'
        }
        this.ws = new WebSocket(`${socketProtocol}://${window.location.host}/ws`)
        this.initWebSocket()
    }

    initWebSocket() {
        this.ws!.onopen = () => this.successfulConection()
        this.ws!.addEventListener('message', this.onReceiveMessage.bind(this))
        window.onbeforeunload = () => {
            this.ws!.close()
        }
    }

    successfulConection() {
        this.ws!.send(this.getPlayerLoginData())
        this.gameScreen.style.display = 'block'
        this.bagElement.style.display = 'block'
        this.coinsElement.style.display = 'block'
        this.gearElement.style.display = 'block'
        this.exitElement.style.display = 'block'
        this.hpTextElement.style.display = 'block'
        this.xpTextElement.style.display = 'block'
        this.chatElement.style.display = 'block'
        this.loginScreen.style.display = 'none'
        this.loadingElement.style.display = 'none'

        // remove this when we have seller npcs
        document.getElementById('coins')!.innerHTML = `${this.playerName}`
        
        this.pingPong()
    }

    getPlayerLoginData() {
        const playerLoadData = localStorage.getItem(this.localStorageLoadKey)
        const playerData = playerLoadData ? playerLoadData : '0'
        const adminPassword = this.adminPassword ? this.adminPassword : '0'
        const playerMatrix = JSON.stringify(this.playerMatrix)

        return `${Command.Login},${this.playerName},${this.getRandomPlayerColor()},${playerData},${adminPassword},${playerMatrix}`
    }

    onReceiveMessage(event: any) {
        const data = event.data
        this.parser.parse(data)
    }

    updatePlayer(moveData: any) {
        for (const player of this.game.spritesLayer.players) {
            if (player.id == moveData.playerId) {
                if (this.playerId == moveData.playerId) {
                    if (moveData.currentRoomId != this.currentRoomId) {
                        this.drawRoom(moveData.currentRoomId)
                        this.currentRoomId = moveData.currentRoomId
                    }
                }
                player.move(moveData.x, moveData.y, moveData.currentRoomId)
            }
        }
        this.drawSprites()
    }

    updateNpc(moveData: any) {
        const npc = this.game.spritesLayer.getNpcByIdAndRoom(moveData.id, moveData.roomId)
        npc!.move(moveData)
        if (!npc!.isFighting) {
            this.drawSprites()
        }
    }

    drawRoom(roomId: Rooms) {
        this.currentRoom.clear()
        this.currentRoom = this.game.map.getRoomById(roomId)
        this.currentRoom.draw()
    }

    drawSprites() {
        this.game.spritesLayer.draw(this.currentRoomId)
    }

    checkMovement() {
        clearTimeout(this.movementTimeout)

        this.movementTimeout = window.setTimeout(() => {
            if (this.isMobile && this.mobileCanMove) {
                this.checkKey({ keyCode: this.mobileDirection })
            }

            let canMoveDesktop = false
            let desktopDirection = 0
            for (let [key, value] of Object.entries(this.keys)) {
                if (value === true) {
                    canMoveDesktop = true
                    desktopDirection = Number(key)
                }
            }
            if (!this.isMobile && canMoveDesktop) {
                this.checkKey({ keyCode: desktopDirection })
            }

            this.checkMovement()
        }, 50)
    }

    setKeyPressed(e: Partial<KeyboardEvent>) {
        const arrowKeysCodes = [37,38,39,40]
        const wasdKeysCodes = [87,83,65,68]
        const isArrowPressed = arrowKeysCodes.some(code => code == e.keyCode)
        const isWasdPressed = wasdKeysCodes.some(code => code == e.keyCode)
        if (e.preventDefault) {
            if (isArrowPressed) {
                e.preventDefault()
            }
        }
        
        if (e.keyCode && (isArrowPressed || isWasdPressed)) {
            if (!this.keys[`${e.keyCode}`]) {
                this.keys[`${e.keyCode}`] = true;
            }
        }
    }

    checkKey(e: Partial<KeyboardEvent>) {
        this.afkTabMinCountdown = 9
        this.afkTabSecCountdown = 59
        this.restartAfkTimer()
        if (this.canMove) {
            this.delayMove()

            let direction = 0
            if (e.keyCode == 38 || e.keyCode == 87) {
                direction = Direction.Up
            } else if (e.keyCode == 40 || e.keyCode == 83) {
                direction = Direction.Down
            } else if (e.keyCode == 37 || e.keyCode == 65) {
                direction = Direction.Left
            } else if (e.keyCode == 39 || e.keyCode == 68) {
                direction = Direction.Right
            } else if (e.keyCode == 13 && !this.isTyping && this.canChat) {
                this.chatMessageElement.focus()
                this.chatMessageElement.select()
            }

            if (this.loggedIn) {
                const player = this.game.spritesLayer.getPlayerById(this.playerId)!
                const isValidMove = player.isValidMove(direction, this.currentRoom.solidLayerShape)
    
                if (isValidMove && !this.isTyping && direction !== 0) {
                    this.ws!.send(`${Command.Move},${direction}`)
                }
            }
        }
    }

    delayMove() {
        this.canMove = false
        setTimeout(() => {
            this.canMove = true
        }, 100)
    }

    drawPve(pveData: any) {
        if (pveData.attacker == PveAttacker.Npc) {
            const player = this.game.spritesLayer.getPlayerById(pveData.playerId)!
            player.takeDamage(pveData)
            this.updateHpElements(player.hp, player.maxHp, pveData.playerId)
        } else {
            const npc = this.game.spritesLayer.getNpcByIdAndRoom(pveData.npcId, pveData.roomId)
            npc!.takeDamage(pveData)
        }
        this.drawSprites()
    }

    applyStats(hp: number, maxHp: number, atk: number, def: number, lvl: number, xp: number, xpNeeded: number) {
        const player = this.game.spritesLayer.getPlayerById(this.playerId)!
        player.hp = hp
        player.maxHp = maxHp
        this.updateHpElements(player.hp, player.maxHp, this.playerId)
        this.updateStatsElements(atk, def, this.playerId)
        this.updateXpElements(lvl, xp, xpNeeded, this.playerId)
    }

    dropItem(itemId: ItemsIds) {
        this.ws!.send(`${Command.ItemDrop},${itemId}`)
    }

    useItem(itemId: ItemsIds) {
        this.ws!.send(`${Command.ItemUse},${itemId}`)
    }

    pickItem(data: ParseItemPick) {
        this.bag.addItem(data.itemId, data.coins, data.playerId)
        this.game.spritesLayer.removeItem(data)
    }

    removeGear(itemId: ItemsIds) {
        this.ws!.send(`${Command.ItemRemove},${itemId}`)
    }

    removedGear(data: ParseItemRemove) {
        this.gear.removeGear(data.itemId)
        this.bag.addItem(data.itemId,0,this.playerId)
    }

    updateHpElements(hp: number, maxHp: number, playerId: string) {
        if (this.playerId == playerId) {
            this.hpTextElement.innerHTML = `HP: ${hp}/${maxHp}`
            const barWidth = (hp/maxHp) * 100
            this.hpBarElement.style.width = `${barWidth}%`
        }
    }

    updateStatsElements(atk: number, def: number, playerId: string) {
        if (this.playerId == playerId) {
            this.atkTextElement.innerHTML = `atk: ${atk}`
            this.defTextElement.innerHTML = `def: ${def}`
        }
    }

    updateXpElements(level: number, xp: number, xpNeeded: number, playerId: string) {
        if (this.playerId == playerId) {
            this.xpTextElement.innerHTML = `LVL ${level}`
            const barWidth = (xp/xpNeeded) * 100
            this.xpBarElement.style.width = `${barWidth}%`
        }
    }

    displayPlayerSaved() {
        this.game.spritesLayer.displayPlayerSaved()
    }

    displayMessage(message: string) {
        if (!this.isShowingMessage) {
            this.isShowingMessage = true
            this.messageElement.innerHTML = message
            setTimeout(() => {
                this.isShowingMessage = false
                this.messageElement.innerHTML = ''
            }, 5000)
        }
    }

    displayDialog(message: string, isQuestStart: boolean, isWarning: boolean) {
        if (!this.isShowingMessage) {
            clearTimeout(this.messageTimeout)
            
            if (isQuestStart) {
                this.messageElement.style.color = Color.LightRed
            } else if (isWarning){
                this.messageElement.style.color = Color.Yellow
            } else {
                this.messageElement.style.color = '#e5e5e5'
            }
            this.messageElement.innerHTML = message

            this.messageTimeout = window.setTimeout(() => {
                this.messageElement.innerHTML = ''
            }, 5000)
        }
    }

    displayChat(message: string, playerId: string) {
        if (playerId == this.playerId) {
            this.startChatTimeout()
        }

        const player = this.game.spritesLayer.getPlayerById(playerId)
        player?.drawChat(message)
    }

    sendChat() {
        if (this.chatMessageElement.value && (this.chatMessageElement.value.length <= 50) && this.canChat) {
            var re = new RegExp('"', 'g');
            const message = this.chatMessageElement.value.replace(re,'\'')
            this.isTyping = false
            this.chatMessageElement.blur()
            this.canChat = false
            this.chatBtn.disabled = true
            this.chatBtn.value = `${this.chatTimeout}`
            this.ws!.send(`${Command.Chat},"${message}"`)
            this.chatMessageElement.value = ''
        }
    }

    startChatTimeout() {
        setTimeout(() => {
            this.chatTimeout-=1
            if (this.chatTimeout < 0) {
                this.chatTimeout = 5
                this.chatBtn.value = `send`
                this.chatBtn.disabled = false
                this.canChat = true
            } else {
                this.chatBtn.value = `${this.chatTimeout}`
                this.startChatTimeout()
            }            
        }, 1000)
    }

    updateRank(rank: ParseRank) {
        const top1Text = rank.top1Level != 0 ? `${rank.top1Name}: LVL ${rank.top1Level}` : ''
        const top2Text = rank.top2Level != 0 ? `${rank.top2Name}: LVL ${rank.top2Level}` : ''
        const top3Text = rank.top3Level != 0 ? `${rank.top3Name}: LVL ${rank.top3Level}` : ''
        this.top1Element.innerHTML = `${top1Text}`
        this.top2Element.innerHTML = `${top2Text}`
        this.top3Element.innerHTML = `${top3Text}`
    }

    toggleRank() {
        if(!this.isShowingRank) {
            this.isShowingRank = true
            this.showRankBtn.value = 'hide rank'
            this.rankElement.style.display = 'block'
        } else {
            this.isShowingRank = false
            this.showRankBtn.value = 'show rank'
            this.rankElement.style.display = 'none'
        }
    }

    togglePlayers() {
        if(!this.isShowingPlayerList) {
            this.isShowingPlayerList = true
            this.showPlayersBtn.value = 'hide players'
            this.playersElement.style.display = 'block'
        } else {
            this.isShowingPlayerList = false
            this.showPlayersBtn.value = 'show players'
            this.playersElement.style.display = 'none'
        }
    }

    toggleEntityInfo() {
        if(!this.isShowingEntityInfo) {
            this.isShowingEntityInfo = true
            this.entityInfoElement.style.display = 'block'
            this.showEntityInfoBtn.style.display = 'block'
        } else {
            this.isShowingEntityInfo = false
            this.entityInfoElement.style.display = 'none'
            this.showEntityInfoBtn.style.display = 'none'
        }
    }

    updatePlayerId(data: ParsePlayerIdUpdate) {
        this.game.spritesLayer.updatePlayerId(data.oldId, data.newId)
    }

    savePlayerData(playerHexData: string) {
        localStorage.setItem(this.localStorageLoadKey, playerHexData)
        this.displayPlayerSaved()
    }

    resetPlayerData() {
        localStorage.removeItem(this.localStorageLoadKey)
        console.log('data erased')
    }

    reloadPlayerBag(loadData: ParseLoadBag) {
        this.reloadItems(loadData.itemsIds)
    }

    loadPlayerData(loadData: ParseLoad) {
        this.game.spritesLayer.updatePlayerId(this.playerId, loadData.id)
        this.playerId = loadData.id
        this.bag.playerId = loadData.id
        this.gear.playerId = loadData.id
        
        this.applyStats(loadData.hp, loadData.maxHp, loadData.attack, loadData.defense, loadData.level, loadData.xp, loadData.xpNeeded)
        this.loadItems(loadData.itemsIds)
        this.loadGear(loadData.gearHead, loadData.gearTorso, loadData.gearLegs, loadData.gearWeapon)
    }

    loadItems(items: ItemsIds[]) {
        for (const itemId of items) {
            this.bag.addItem(itemId, 0, this.playerId)
        }
    }

    reloadItems(items: ItemsIds[]) {
        this.bag.removeAllItems()
        for (const itemId of items) {
            this.bag.addItem(itemId, 0, this.playerId)
        }
    }

    loadGear(head: ItemsIds | null, torso: ItemsIds | null, legs: ItemsIds | null, weapon: ItemsIds | null) {
        if (head) {
            this.gear.addGear(head, GearType.Head)
        }
        if (torso) {
            this.gear.addGear(torso, GearType.Torso)
        }
        if (legs) {
            this.gear.addGear(legs, GearType.Legs)
        }
        if (weapon) {
            this.gear.addGear(weapon, GearType.Weapon)
        }
    }

    sendEntityInfo() {
        if (this.game.spritesLayer.clickedEntityId) {
            this.ws!.send(`${Command.EntityInfo},${this.game.spritesLayer.clickedX},${this.game.spritesLayer.clickedY}`)
            this.game.spritesLayer.clickedEntityId = ''
        }
    }

    hideEntityInfo() {
        this.isShowingEntityInfo = true
        this.toggleEntityInfo()
    }

    showEntityInfo(data: ParseEntityInfo) {
        const success = this.fillEntityInfo(data)
        if (success) {
            this.isShowingEntityInfo = false
            this.toggleEntityInfo()
        }
    }

    fillEntityInfo(data: ParseEntityInfo): boolean {
        let success = true
        const player = this.game.spritesLayer.getPlayerById(this.playerId)!
        if (data.isNpc) {
            const npcSelected = this.game.spritesLayer.getNpcByIdAndRoom(data.npcId, player.currentRoomId)
            if (npcSelected) {
                if (data.level !== 0) {
                    this.maxHpInfoElement.innerHTML = `Total HP: ${npcSelected.maxHp}`
                    this.itemsInfoElement.innerHTML = `Drops: ${data.items.join(', ')}`
                    this.nameInfoElement.innerHTML = `Name: ${data.name}`
                    this.levelInfoElement.innerHTML = `Level: ${data.level} (atk ${data.attack}/def ${data.defense})`
                } else {
                    this.maxHpInfoElement.innerHTML = ``
                    this.itemsInfoElement.innerHTML = ``
                    this.nameInfoElement.innerHTML = `Name: ${data.name}`
                    this.levelInfoElement.innerHTML = ``
                }
                
                new TinyIcon(npcSelected.tileMatrix, 'img-info', '')
            } else {
                success = false
            }
        } else {
            const playerSelected = this.game.spritesLayer.getPlayerByName(data.name)
            if (playerSelected) {
                this.maxHpInfoElement.innerHTML = `Total HP: ${playerSelected.maxHp}`
                this.itemsInfoElement.innerHTML = `Gear: ${data.items.join(', ')}`
                this.nameInfoElement.innerHTML = `Name: ${data.name}`
                this.levelInfoElement.innerHTML = `Level: ${data.level} (atk ${data.attack}/def ${data.defense})`
                new TinyIcon(playerSelected.matrix, 'img-info', playerSelected.color)
            } else {
                success = false
            }
        }

        return success
    }

    sendExitRequest() {
        this.ws!.send(`${Command.Exit}`)
    }

    exitConfirmed(data: string) {
        this.savePlayerData(data)
        alert('Exit Successful!')
        window.location.reload()
    }

    getRandomPlayerColor() {
        return PlayerColors[Math.floor(Math.random() * PlayerColors.length)]
    }

    restartAfkTimer(): void {
        clearTimeout(this.afkTimeout)
        this.afkTimeout = window.setTimeout(async () => {
            this.displayMessage('after 10min afk you will be kicked')
            this.restartAfkTimer()
        }, this.afkInterval);
    }

    showStatusOnTab() {
        setTimeout(async () => {
            this.afkCountdownTick()
            if (document.hidden) {
                const player = this.game.spritesLayer.getPlayerById(this.playerId)!
                document.title = `AFK: ${this.afkTabMinCountdown}:${this.afkTabSecCountdown} HP: ${player.hp}`;
            } else {
                document.title = 'TLO'
            }

            this.showStatusOnTab()
        }, 900);
    }

    afkCountdownTick() {
        if (this.afkTabMinCountdown > 0 && this.afkTabSecCountdown == 0) {
            this.afkTabMinCountdown -= 1
        }

        if (this.afkTabSecCountdown == 0) {
            if (this.afkTabMinCountdown > 0) {
                this.afkTabSecCountdown = 59
            }
        } else {
            this.afkTabSecCountdown -= 1
        }
    }

    pingPong() {
        this.ws!.send(`${Command.Ping}`)

        setTimeout(() => {
            this.pingPong()
        }, 20000)
    }
}
