import { Game } from '../../startup/Game'
import { Player } from '../../entities/Player'
import { Npc } from '../../entities/Npc'
import { Rooms, ItemsIds } from '../../../../shared/Enums'
import { Npcs } from '../../entities/Npcs'
import { Item } from '../../entities/items/Item'
import { Items } from '../../entities/items/Items'
import { Color } from '../map/tiles/Color'
import { ParsePlayersInRoom } from '../../parser/ParsePlayersInRoom'
import { NpcDto } from '../../parser/ParseNpcsInRoom'
import { ItemDto } from '../../parser/ParseItemsInRoom'
import { ParseItemDrop } from '../../parser/ParseItemDrop'

export class SpritesLayer {
    public ctx: CanvasRenderingContext2D
    public players: Player[]
    public playerHasBeenSaved: boolean = false
    public clickedEntityId: string | undefined
    public clickedX: number | undefined
    public clickedY: number | undefined

    private game: Game
    private playerListElement: HTMLElement
    private npcs: Npc[]
    private items: any[]
    private playerSavedTimeout: number = 0

    constructor(game: Game) {
        this.game = game

        this.playerListElement = document.getElementById('player-list')!
        const canvas = document.getElementById('sprites-layer') as HTMLCanvasElement
        canvas.onclick = (e: MouseEvent) => this.setClickedEntity(e)
        canvas.ontouchstart = (e: TouchEvent) => this.setClickedEntity(e)
        this.ctx = canvas.getContext('2d')!
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.shadowBlur = 0
        this.ctx.shadowColor = ''
        this.ctx.canvas.width = this.game.gridConfig.width
        this.ctx.canvas.height = this.game.gridConfig.height

        this.players = []
        this.npcs = []
        this.items = []
    }

    draw(clientRoomId: any) {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
        this.drawItems(clientRoomId)
        this.drawNpcs(clientRoomId)
        this.drawPlayers(clientRoomId)
        if (this.playerHasBeenSaved) {
            this.displayPlayerSavedMessage()
        }
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.game.gridConfig.width, this.game.gridConfig.height)
    }

    addPlayers(players: any[]) {
        this.players.splice(0, this.players.length)
        for (const player of players) {
            this.players.push(new Player(this.game, player, this))
        }
    }

    addNpcs(npcs: NpcDto[]) {
        this.npcs.splice(0, this.npcs.length)
        for (const npc of npcs) {
            this.npcs.push(new Npc(this.game, this, npc, this.getMatrixNpcById(npc.npcId), npc.npcId))
        }
    }

    addItems(items: ItemDto[]) {
        this.items.splice(0, this.items.length)
        for (const item of items) {
            this.items.push(new Item(this.game, this, item, this.getMatrixItemById(item.itemId)))
        }
    }

    updatePlayersPositions(data: ParsePlayersInRoom, clientPlayerId: string) {
        for (const player of this.players) {
            const dataInRoom = data.playersInRoom.find(x => x.id === player.id)
            if (dataInRoom) {
                player.move(dataInRoom.x, dataInRoom.y, data.roomId)
            } else if (player.id !== clientPlayerId) {
                player.move(-1, -1, -1)
            }
        }
    }

    addItem(item: ParseItemDrop) {
        this.items.push(new Item(this.game, this, item, this.getMatrixItemById(item.itemId)))
    }

    removeItem(itemRemoved: any) {
        const index = this.items.findIndex(item => item.x == itemRemoved.x && item.y == itemRemoved.y)
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    drawPlayers(clientRoomId: any) {
        while (this.playerListElement.firstChild) {
            this.playerListElement.removeChild(this.playerListElement.firstChild)
        }

        this.players.forEach((player) => {
            const li = document.createElement('li')
            li.appendChild(document.createTextNode(player.name))
            li.style.color = player.color
            li.style.textShadow = `1px 1px 2px white`
            this.playerListElement.appendChild(li)

            if (player.currentRoomId == clientRoomId) {
                player.draw()
                if (player.isFighting) {
                    player.drawHp()
                }

                if (player.chatMessage !== '') {
                    player.drawChatMessage()
                }
            }
        })
    }

    drawNpcs(clientRoomId: Rooms) {
        this.npcs.forEach((npc) => {
            if (npc.roomId == clientRoomId) {
                npc.draw()
                if (npc.isFighting) {
                    npc.drawHp()
                }
            }
        })
    }

    drawItems(clientRoomId: Rooms) {
        this.items.forEach((item) => {
            if (item.roomId == clientRoomId) {
                item.draw()
            }
        })
    }

    displayPlayerSaved() {
        clearTimeout(this.playerSavedTimeout)
        this.playerHasBeenSaved = true
        this.ctx.font = '20px arial';
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = Color.LightGreen3
        this.ctx.fillText("Player saved", 5, 15);
        this.playerSavedTimeout = window.setTimeout(() => {
            this.playerHasBeenSaved = false
        }, 5000)
    }

    displayPlayerSavedMessage() {
        this.ctx.font = '20px arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = Color.LightGreen
        this.ctx.fillText("Player saved", 5, 15)
    }

    updatePlayerId(oldId: string, newId: string) {
        const index = this.players.findIndex((x) => x.id === oldId)
        if (index != -1) {
            this.players[index].id = newId
        }
    }

    getPlayerById(id: string) {
        return this.players.find((x) => x.id === id)
    }

    getPlayerByName(name: string) {
        return this.players.find((x) => x.name === name)
    }

    getNpcByIdAndRoom(id: number, roomId: Rooms) {
        return this.npcs.find((x) => x.id === +id && x.roomId === +roomId)
    }

    getMatrixNpcById(npcId: number) {
        let npcMatrix = Npcs[Object.keys(Npcs)[npcId - 1]] as any
        if (!npcMatrix) {
            console.log('No sprite defined')
        }

        return npcMatrix
    }

    getMatrixItemById(itemId: ItemsIds) {
        let keyOfItemId = ItemsIds[itemId]
        let items = Items as any
        return items[keyOfItemId]
    }

    setClickedEntity(e: MouseEvent | TouchEvent) {
        e = e || window.event
        const pos = this.getOffset(e)
        const x = Math.floor(pos.x / this.game.gridConfig.cellWidth)
        const y = Math.floor(pos.y / this.game.gridConfig.cellHeight)
        const repeatedClick = x === this.clickedX && y === this.clickedY
        if (!repeatedClick) {
            this.clickedX = x
            this.clickedY = y
            this.clickedEntityId = this.getEntityIdAtCoords(x, y)
        }
    }

    private getEntityIdAtCoords(x: number, y: number): string | undefined {
        const playerAtCoords = this.players.filter(player => player.x === x && player.y === y)
        const npcAtCoords = this.npcs.filter(npc => npc.x === x && npc.y === y)
        return playerAtCoords[0]? playerAtCoords[0].id : npcAtCoords[0]?.npcId.toString()
    }

    private getOffset(e: MouseEvent | TouchEvent) {
        let clientX = 0
        let clientY = 0
        if (window.TouchEvent && e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX
                clientY = e.touches[0].clientY
            }
        } else {
            clientX = (e as MouseEvent).clientX
            clientY = (e as MouseEvent).clientY
        }
        const target = <HTMLElement>e.target || e.srcElement,
            rect = target.getBoundingClientRect(),
            offsetX = clientX - rect.left,
            offsetY = clientY - rect.top

        return { x: offsetX | 0, y: offsetY | 0 }
    }
}
