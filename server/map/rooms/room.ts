import { Player } from '../../entities/player.ts'
import Exits from "./exits.ts"
import { Npc } from '../../entities/npc.ts'
import { ClientHandler } from '../../clientHandler.ts'
import ItemBase from '../../entities/items/itemBase.ts'

export default class Room {
  public id: number
  public solidLayer: any
  public players: Player[] = []
  public npcSpawns: any
  public npcs: Npc[] = []
  public exits: Exits
  public clientHandler: ClientHandler
  public itemsLayer: any
  public itemsCount: number = 0
  public boardRows: number = 16
  public boardColumns: number = 16

  constructor(id: number, exits: Exits, clientHandler: ClientHandler) {
    this.id = id
    this.exits = exits
    this.clientHandler = clientHandler
    this.boardRows = clientHandler.boardRows
    this.boardColumns = clientHandler.boardColumns
    this.itemsLayer = this.buildItemsLayer()
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }

  removePlayer(player: Player) {
    const index = this.players.indexOf(player)
    if (index > -1) {
      this.players.splice(index, 1)
    }
  }

  spawnNpcs() {
    let npcs = 0
    for (let i=0; i<this.npcSpawns.length; i++) {
      for (let j=0; j<this.npcSpawns[0].length; j++) {
        npcs++
        const npcToSpawn = this.npcSpawns[j][i]

        if (npcToSpawn !== 0) {
          this.npcs.push(new Npc(npcs, npcToSpawn, i, j, this.boardRows, this.boardColumns, this))
        } else {
          npcs--
        }
      }
    }
  }

  goNorth(): any {
    let isValid = false
    if (this.exits.hasNorth()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.n }
  }

  goSouth(): any {
    let isValid = false
    if (this.exits.hasSouth()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.s }
  }

  goWest(): any {
    let isValid = false
    if (this.exits.hasWest()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.w }
  }

  goEast(): any {
    let isValid = false
    if (this.exits.hasEast()) {
      isValid = true
    }
    return { valid: isValid, roomId: this.exits.e }
  }

  addItem(y: number, x: number, item: ItemBase) {
    this.itemsCount++
    const nextId = this.itemsCount

    let clonedItem = { ...item }
    clonedItem.id = nextId
    this.itemsLayer[y][x] = clonedItem

    this.clientHandler.roomcastItemDrop({
      id: clonedItem.id,
      itemId: clonedItem.itemId
    }, this.id, y, x)

    this.startDespawnTimer(y, x, clonedItem.despawnTime)
  }

  removeItem(y: number, x: number, playerId: string) {
    const item = this.itemsLayer[y][x]
    if (item != 0) {
      this.itemsLayer[y][x] = 0
      this.resetItemsCount()
  
      this.clientHandler.roomcastItemPick(this.id, y, x, item.itemId, item.coins, playerId)
    }
  }

  getAllNpcsInRoom() {
    let npcsReturn = []
    for (const npc of this.npcs) {
      npcsReturn.push(npc.getReturnData())
    }
    return npcsReturn
  }

  getAllItemsInRoom() {
    let itensReturn = []

    for (let i=0; i<this.itemsLayer.length; i++) {
      for (let j=0; j<this.itemsLayer[0].length; j++) {
        const position = this.itemsLayer[j][i]

        if (position !== 0) {
          const item = position as ItemBase
          itensReturn.push({
            id: item.id,
            itemId: item.itemId,
            x:i,
            y:j
          })
        }
      }
    }

    return itensReturn
  }

  resetItemsCount(): number {
    const currentItens = this.getAllItemsInRoom()
    let greatestId = 0
    for (const item of currentItens) {
      if (item.id > greatestId) {
        greatestId = item.id
      }
    }
    if (greatestId == 0) {
      this.itemsCount = 0
    }

    return greatestId
  }

  startDespawnTimer(y: number, x: number, despawnTime: number) {
    setTimeout(() => { 
      this.removeItem(y,x,'')
    }, despawnTime);
  }

  private buildItemsLayer(): any {
    return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  }
}