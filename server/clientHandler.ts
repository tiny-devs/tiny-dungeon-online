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
  private topPlayers: {name:string,level:number}[]

  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns

    this.map = new Map(this)

    this.topPlayers = []
    this.topPlayers.push({name:'',level:0})
    this.topPlayers.push({name:'',level:0})
    this.topPlayers.push({name:'',level:0})
  }

  private broadcastRank(): void {
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          player.clientWs.send(`${Command.Rank},`+
          `${this.topPlayers[0].name},`+
          `${this.topPlayers[0].level},`+
          `${this.topPlayers[1].name},`+
          `${this.topPlayers[1].level},`+
          `${this.topPlayers[2].name},`+
          `${this.topPlayers[2].level}`)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    try{
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
    } catch (e) {
      console.log(e)
    }
  }

  public broadcastPlayerMove(playerMoved: Player, direction: Direction): void {
    try{
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
    } catch (e) {
      console.log(e)
    }
  }

  public roomcastNpcMove(npcMoved: Npc): void {
    try{
      for (const player of npcMoved.room.players) {
        player.clientWs.send(`${Command.NpcMove},`+
        `${npcMoved.id},` +
        `${npcMoved.npcId},`+
        `${npcMoved.x},`+
        `${npcMoved.y},` +
        `${npcMoved.roomId}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  public roomcastPveFight(pveData: PveData): void {
    try{
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
    } catch (e) {
      console.log(e)
    }
  }

  public roomcastItemDrop(itemData: any, roomId: number, y: number, x: number): void {
    try{
      const room = this.map.getRoomById(roomId)
      
      for (const player of room.players) {
        player.clientWs.send(`${Command.ItemDrop},`+
        `${itemData.id},` +
        `${itemData.itemId},`+
        `${roomId},` +
        `${x},${y}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  public roomcastItemPick(roomId: number, y: number, x: number, itemId: Items, coins: number, playerId: string): void {
    try{
      const room = this.map.getRoomById(roomId)

      for (const player of room.players) {
        player.clientWs.send(`${Command.ItemPick},`+
        `${playerId},`+
        `${itemId},${coins},`+
        `${x},${y}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  private switchRooms(player: Player, newRoom: Room) {
    try{
      player.currentRoom.removePlayer(player)

      player.currentRoomId = newRoom.id
      player.currentRoom = newRoom
      newRoom.addPlayer(player)

      this.unicastNpcsInRoom(player)
      this.unicastItemsInRoom(player)
    } catch (e) {
      console.log(e)
    }
  }

  private roomcastItemsInRoom(room: Room): void {
    try{
      const data = JSON.stringify(room.getAllItemsInRoom())

      for (const player of room.players) {
        player.clientWs.send(`${Command.ItemsInRoom},${data}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  public unicastMessage(player: Player, message: string): void {
    try{
      player.clientWs.send(`${Command.Message},${message}`)
    } catch (e) {
      console.log(e)
    }
  }

  public unicastItemRemove(player: Player, itemId: Items): void {
    try{
      player.clientWs.send(`${Command.ItemRemove},${itemId}`)
    } catch (e) {
      console.log(e)
    }
  }

  public unicastItemWear(player: Player, itemId: Items, gearType: GearType): void {
    try{
      player.clientWs.send(`${Command.ItemWear},${itemId},${gearType}`)
    } catch (e) {
      console.log(e)
    }
  }

  public unicastPlayerStats(player: Player): void {
    try{
      const data = player.getStats()
      player.clientWs.send(`${Command.Stats},`+
      `${data.hp},${data.maxHp},${data.attack},${data.defense},`+
      `${data.level},${data.xp},${data.xpNeeded}`)
    } catch (e) {
      console.log(e)
    }
  }

  public unicastDialog(player: Player, dialog: string) {
    try {
      player.clientWs.send(`${Command.Dialog},`+
      `"${dialog}"`)
    } catch (e) {
      console.log(e)
    }
  }

  private unicastItemsInRoom(player: Player): void {
    try{
      const data = JSON.stringify(player.currentRoom.getAllItemsInRoom())
      player.clientWs.send(`${Command.ItemsInRoom},${player.currentRoomId},${data}`)
    } catch (e) {
      console.log(e)
    }
  }

  private unicastNpcsInRoom(player: Player): void {
    try{
      const data = JSON.stringify(player.currentRoom.getAllNpcsInRoom())
      player.clientWs.send(`${Command.NpcsInRoom},${data}`)
    } catch (e) {
      console.log(e)
    }
  }

  private unicastItemUse(player: Player, itemId: Items): void {
    try{
      player.clientWs.send(`${Command.ItemUse},${itemId}`)
    } catch (e) {
      console.log(e)
    }
  }

  private unicastPlayerDroped(player: Player, itemId: Items): void {
    try{
      player.clientWs.send(`${Command.ItemDroped},${itemId}`)
    } catch (e) {
      console.log(e)
    }
  }

  private unicastRank(player: Player): void {
    try{
      player.clientWs.send(`${Command.Rank},`+
        `${this.topPlayers[0].name},`+
        `${this.topPlayers[0].level},`+
        `${this.topPlayers[1].name},`+
        `${this.topPlayers[1].level},`+
        `${this.topPlayers[2].name},`+
        `${this.topPlayers[2].level}`)
    } catch (e) {
      console.log(e)
    }
  }

  public updateRank() {
    let updated = false
    let players = []
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        players.push(player)
      }
    }
    players.sort((a, b) => { 
      return b.level - a.level;
    })

    const limitForTop3OrLess = players.length > 3 ? 3 : players.length
    for (let i=0;i<limitForTop3OrLess;i++) {
      for (let j=0;j<3;j++) {
        if ((players[i].level>this.topPlayers[j].level)) {
          const indexTopPlayer = this.topPlayers.map(p => p.name).indexOf(players[i].name)
          if (indexTopPlayer>-1) {
            this.topPlayers[j].level = players[i].level
            this.topPlayers.splice(j, 0, this.topPlayers.splice(indexTopPlayer, 1)[0]);
          } else {
            this.topPlayers.splice(j, 0, {name:players[i].name,level:players[i].level});
            if(this.topPlayers.length > 3) {
              this.topPlayers.pop()
            }
          }
          j = 3
          updated = true
        }
      }
    }

    players.splice(0, players.length)
    if (updated) {
      this.broadcastRank()
    }

    return updated
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
            const updatedRank = this.updateRank()
            if (!updatedRank) {
              this.unicastRank(player)
            }
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