import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Player } from './entities/player.ts'
import { Command, Direction, Items, GearType } from './Enums.ts'
import Room from './map/rooms/room.ts'
import Map from './map/map.ts'
import { Npc } from './entities/npc.ts'
import { PveData } from './pve/pveData.ts'

export class ClientHandler {
  public boardColumns: number = 16
  public boardRows: number = 16
  public playerNames: string[] = []
  public map: Map

  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns

    this.map = new Map(this)
  }

  private broadcastPlayerConnection(playerId: string): void {
    const data = JSON.stringify(this.getAllPlayers())

    for (const room of this.map.rooms) {
      for (const player of room.players) {
        player.clientWs.send(`${Command.Login},`+
        `${playerId},`+
        `${this.boardRows},`+
        `${this.boardColumns},`+
        `${data}`)
      }
    }
  }

  public broadcastPlayerMove(playerMoved: Player, direction: Direction): void {
    let isValid = playerMoved.move(direction)
    if (playerMoved.changedRoom()) {
      const newRoom = this.map.getRoomById(playerMoved.currentRoomId)
      this.switchRooms(playerMoved, newRoom)
    }
  
    if (isValid) {
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          player.clientWs.send(`${Command.Move},`+
          `${playerMoved.id},`+
          `${playerMoved.x},`+
          `${playerMoved.y},`+
          `${playerMoved.currentRoomId}`)
        }
      }
    }
  }

  public roomcastNpcMove(npcMoved: Npc): void {
    for (const player of npcMoved.room.players) {
      player.clientWs.send(`${Command.NpcMove},`+
      `${npcMoved.id},` +
      `${npcMoved.npcId},`+
      `${npcMoved.x},`+
      `${npcMoved.y},` +
      `${npcMoved.roomId}`)
    }
  }

  public roomcastPveFight(pveData: PveData): void {
    for (const player of pveData.room.players) {
      player.clientWs.send(`${Command.Pve},`+
      `${pveData.attacker},` +
      `${pveData.damageCaused},`+
      `${pveData.npc.hp},` +
      `${pveData.npc.id},` +
      `${pveData.player.hp},` +
      `${pveData.player.id},` +
      `${pveData.room.id}`)
    }
  }

  public roomcastItemDrop(itemData: any, roomId: number, y: number, x: number): void {
    const room = this.map.getRoomById(roomId)
    
    for (const player of room.players) {
      player.clientWs.send(`${Command.ItemDrop},`+
      `${itemData.id},` +
      `${itemData.itemId},`+
      `${roomId},` +
      `${x},${y}`)
    }
  }

  public roomcastItemPick(roomId: number, y: number, x: number, itemId: Items, coins: number, playerId: string): void {
    const room = this.map.getRoomById(roomId)

    for (const player of room.players) {
      player.clientWs.send(`${Command.ItemPick},`+
      `${playerId},`+
      `${itemId},${coins},`+
      `${x},${y}`)
    }
  }

  private switchRooms(player: Player, newRoom: Room) {
    player.currentRoom.removePlayer(player)

    player.currentRoomId = newRoom.id
    player.currentRoom = newRoom
    newRoom.addPlayer(player)

    this.unicastNpcsInRoom(player)
    this.unicastItemsInRoom(player)
  }

  private roomcastItemsInRoom(room: Room): void {
    const data = JSON.stringify(room.getAllItemsInRoom())

    for (const player of room.players) {
      player.clientWs.send(`${Command.ItemsInRoom},${data}`)
    }
  }

  public unicastItemRemove(player: Player, itemId: Items): void {
    player.clientWs.send(`${Command.ItemRemove},${itemId}`)
  }

  public unicastItemWear(player: Player, itemId: Items, gearType: GearType): void {
    player.clientWs.send(`${Command.ItemWear},${itemId},${gearType}`)
  }

  private unicastItemsInRoom(player: Player): void {
    const data = JSON.stringify(player.currentRoom.getAllItemsInRoom())
    player.clientWs.send(`${Command.ItemsInRoom},${player.currentRoomId},${data}`)
  }

  private unicastNpcsInRoom(player: Player): void {
    const data = JSON.stringify(player.currentRoom.getAllNpcsInRoom())
    player.clientWs.send(`${Command.NpcsInRoom},${data}`)
  }

  private unicastItemUse(player: Player, itemId: Items): void {
    player.clientWs.send(`${Command.ItemUse},${itemId}`)
  }

  private unicastPlayerStats(player: Player): void {
    const data = player.getStats()
    player.clientWs.send(`${Command.Stats},`+
    `${data.hp},${data.maxHp},${data.attack},${data.defense}`)
  }

  private unicastPlayerDroped(player: Player, itemId: Items): void {
    player.clientWs.send(`${Command.ItemDroped},${itemId}`)
  }

  private getAllPlayers() {
    let playersReturn = []
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        playersReturn.push(player.getReturnData())
      }
    }
    return playersReturn
  }

  private checkNameDuplicate(name: string, playerWs: WebSocket): boolean {
    let nameExists = this.playerNames.some(pName => pName == name)
    if (nameExists) {
      playerWs.send(`${Command.Error},"Name already exists"`)
      return true
    }
    return false
  }

  private logPlayerOut(player: Player, playerId: string) {
    const room = this.map.getRoomById(player.currentRoom.id)
    room.removePlayer(player)
    this.playerNames = this.playerNames.filter(e => e !== player.name);
    this.broadcastPlayerConnection(playerId)
  }

  private pong(player: Player): void {
    player.clientWs?.send(`${Command.Pong}`)
  }

  private parseEventDataString(eventDataString: string): string[] {
    let rawDataString = eventDataString
    let matrix = ''
    if (eventDataString.includes(',[')) {
      rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['))
      matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length)
    }

    let eventData = rawDataString.split(',')
    if (matrix !== '') {
      eventData.push(matrix)
    }

    return eventData
  }

  public async handleClient(ws: WebSocket): Promise<void> {
    let duplicatedName = false
    const initialRoom = this.map.rooms[0]
    const playerId = v4.generate()
    const player = new Player(playerId, '', '', 0, 0, initialRoom, this.boardRows, this.boardColumns, ws, this)

    initialRoom.addPlayer(player)
  
    for await (const event of ws) {
      const eventDataString = event as string

      if (isWebSocketCloseEvent(event)) {
        this.logPlayerOut(player, playerId)
        break
      }

      try {
        let eventData = this.parseEventDataString(eventDataString);

        switch (+eventData[0]) {
          case Command.ItemDrop:
            const droped = player.bag.dropItem(+eventData[1])
            if (droped) {
              this.unicastPlayerDroped(player, +eventData[1])
            }
            break
          case Command.ItemUse:
            const result = player.bag.useItem(+eventData[1])
            if (result.used) {
              this.unicastItemUse(player,+eventData[1])
              this.unicastPlayerStats(player)
            } else if (result.wore) {
              this.unicastPlayerStats(player)
            }
            break
          case Command.ItemRemove:
            const removed = player.gear.remove(+eventData[1])
            if (removed) {
              this.unicastItemRemove(player, +eventData[1])
              this.unicastPlayerStats(player)
            }
            break
          case Command.Move:
            this.broadcastPlayerMove(player, +eventData[1])
            break
          case Command.Login:
            duplicatedName = this.checkNameDuplicate(eventData[1], ws)
            if (duplicatedName) {
              break
            }

            this.playerNames.push(eventData[1])
            player.name = eventData[1]
            player.color = eventData[2]
            player.matrix = JSON.parse(eventData[3])
            this.broadcastPlayerConnection(playerId)
            this.unicastNpcsInRoom(player)
            this.unicastItemsInRoom(player)
            this.unicastPlayerStats(player)
            break
          case Command.Ping:
            this.pong(player)
            break
        }

        if (duplicatedName) {
          this.logPlayerOut(player, playerId)
          break
        }

      } catch(e) {
        console.log(e)
      }
      
    }
  }
}