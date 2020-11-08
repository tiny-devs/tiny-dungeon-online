import { PlayerConfig } from '../models/configs'
import { Game } from './Game'
import { Main } from './Main'
import { Parser } from '../parser/Parser'
import { Command, PveAttacker, Rooms, Direction, ItemsIds, GearType } from '../models/Enums'
import { Color, PlayerColors } from '../board/map/tiles/Color'
import { Woods } from '../board/map/Woods'
import { InitialRoom } from '../board/map/InitialRoom'
import Bag from '../entities/items/Bag'
import { ParseItemPick } from '../parser/ParseItemPick'
import { ParseItemRemove } from '../parser/ParseItemRemove'
import Gear from '../entities/items/Gear'
import { ParseRank } from '../parser/ParseRank'
import { ParseLoad } from '../parser/ParseLoad'
import { ParsePlayerIdUpdate } from '../parser/ParsePlayerIdUpdate'

export class Client {
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
    private rankElement: HTMLElement
    private playersElement: HTMLElement
    private top1Element: HTMLElement
    private top2Element: HTMLElement
    private top3Element: HTMLElement
    private isShowingMessage: boolean
    private messageTimeout: number
    private up: HTMLElement
    private down: HTMLElement
    private left: HTMLElement
    private right: HTMLElement
    private mobileDirection: number = 0
    private mobileCanMove: boolean = false
    private mobileMovementTimeout : number = 0
    private isShowingRank: boolean
    private isShowingPlayerList: boolean
    private ws: WebSocket | null
    private playerMatrix: number[][]
    private parser: Parser
    private currentRoom: InitialRoom | Woods
    private canMove: boolean
    private chatTimeout: number = 5
    private canChat: boolean = true
    private isTyping: boolean = false
    private localStorageLoadKey: string = 'tinydata'

    constructor(game: Game, clientConfigs: PlayerConfig, mainElements: Main) {
        document.onkeydown = this.checkKey.bind(this)
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
        this.top1Element = mainElements.top1Element
        this.top2Element = mainElements.top2Element
        this.top3Element = mainElements.top3Element
        this.isShowingMessage = false
        this.messageTimeout = 0
        
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

        if (mainElements.isMobile()) {
            this.mobileMovement()
        }

        this.game = game
        this.ws = null
        this.loggedIn = false
        this.playerName = clientConfigs.playerName
        this.playerId = ''
        this.bag = new Bag(this)
        this.gear = new Gear(this)
        this.currentRoomId = Rooms.Initial
        this.playerMatrix = clientConfigs.playerMatrix
        this.parser = new Parser(this)
        this.currentRoom = this.game.map.rooms[0]
        this.canMove = true

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

        // remove this when we have seller npcs
        document.getElementById('coins')!.innerHTML = `${this.playerName}`
        
        this.pingPong()
    }

    getPlayerLoginData() {
        const playerLoadData = localStorage.getItem(this.localStorageLoadKey)
        const playerData = playerLoadData ? playerLoadData : '0'
        const playerMatrix = JSON.stringify(this.playerMatrix)

        return `${Command.Login},${this.playerName},${this.getRandomPlayerColor()},${playerData},${playerMatrix}`
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

    checkKey(e: Partial<KeyboardEvent>) {
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
    
                if (isValidMove && !this.isTyping) {
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

    displayDialog(message: string, isQuestStart: boolean) {
        if (!this.isShowingMessage) {
            clearTimeout(this.messageTimeout)
            
            if (isQuestStart) {
                this.messageElement.style.color = Color.LightRed
            } else {
                this.messageElement.style.color = '#e5e5e5'
            }
            this.messageElement.innerHTML = message

            this.messageTimeout = setTimeout(() => {
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

    updatePlayerId(data: ParsePlayerIdUpdate) {
        this.game.spritesLayer.updatePlayerId(data.oldId, data.newId)
    }

    savePlayerData(playerHexData: string) {
        localStorage.setItem(this.localStorageLoadKey, playerHexData)
        this.displayMessage('player saved!')
    }

    resetPlayerData() {
        localStorage.removeItem(this.localStorageLoadKey)
        console.log('data erased')
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
        for (const item of items) {
            this.bag.addItem(item, 0, this.playerId)
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

    sendExitRequest() {
        this.ws!.send(`${Command.Exit}`)
    }

    exitConfirmed(data: string) {
        this.savePlayerData(data)
        alert('Exit Successful!')
        window.location.reload()
    }

    mobileMovement() {
        clearTimeout(this.mobileMovementTimeout)

        this.mobileMovementTimeout = setTimeout(() => {
            if (this.mobileCanMove) {
                this.checkKey({ keyCode: this.mobileDirection })
            }
            this.mobileMovement()
        }, 110)
    }

    getRandomPlayerColor() {
        return PlayerColors[Math.floor(Math.random() * PlayerColors.length)]
    }

    pingPong() {
        this.ws!.send(`${Command.Ping}`)

        setTimeout(() => {
            this.pingPong()
        }, 20000)
    }
}
