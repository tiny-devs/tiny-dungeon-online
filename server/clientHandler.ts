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
    let currentPlayer = null
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          if (!player.clientWs.isClosed) {
            player.clientWs.send(`${Command.Rank},`+
            `${this.topPlayers[0].name},`+
            `${this.topPlayers[0].level},`+
            `${this.topPlayers[1].name},`+
            `${this.topPlayers[1].level},`+
            `${this.topPlayers[2].name},`+
            `${this.topPlayers[2].level}`)
          } else {
            this.logPlayerOut(player)
          }
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastRank')
      if (success) {
        this.broadcastRank()
      }
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    let currentPlayer = null
    try{
      const data = JSON.stringify(this.getAllPlayers())

      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          if (!player.clientWs.isClosed) {
            player.clientWs.send(`${Command.Login},`+
            `${playerId},`+
            `${this.boardRows},`+
            `${this.boardColumns},`+
            `${data}`)
          } else {
            this.logPlayerOut(player)
          }
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastPlayerConnection')
      if (success) {
        this.broadcastPlayerConnection(playerId)
      }
    }
  }

  public broadcastPlayerMove(playerMoved: Player, direction: Direction): void {
    let currentPlayer = null
    try{
      let isValid = playerMoved.move(direction)
      if (playerMoved.changedRoom()) {
        const newRoom = this.map.getRoomById(playerMoved.currentRoomId)
        this.switchRooms(playerMoved, newRoom)
      }
    
      if (isValid) {
        for (const room of this.map.rooms) {
          for (const player of room.players) {
            currentPlayer = player
            if (!player.clientWs.isClosed) {
              player.clientWs.send(`${Command.Move},`+
              `${playerMoved.id},`+
              `${playerMoved.x},`+
              `${playerMoved.y},`+
              `${playerMoved.currentRoomId}`)
            } else {
              this.logPlayerOut(player)
            }
          }
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastPlayerMove')
      if (success) {
        this.broadcastPlayerMove(playerMoved,direction)
      }
    }
  }

  public roomcastNpcMove(npcMoved: Npc): void {
    let currentPlayer = null
    try{
      for (const player of npcMoved.room.players) {
        currentPlayer = player
        if (!player.clientWs.isClosed) {
          player.clientWs.send(`${Command.NpcMove},`+
          `${npcMoved.id},` +
          `${npcMoved.npcId},`+
          `${npcMoved.x},`+
          `${npcMoved.y},` +
          `${npcMoved.roomId}`)
        } else {
          this.logPlayerOut(player)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastNpcMove')
      if (success) {
        this.roomcastNpcMove(npcMoved)
      }
    }
  }

  public roomcastPveFight(pveData: PveData): void {
    let currentPlayer = null
    try{
      for (const player of pveData.room.players) {
        currentPlayer = player
        if (!player.clientWs.isClosed) {
          player.clientWs.send(`${Command.Pve},`+
          `${pveData.attacker},` +
          `${pveData.damageCaused},`+
          `${pveData.npc.hp},` +
          `${pveData.npc.id},` +
          `${pveData.player.hp},` +
          `${pveData.player.id},` +
          `${pveData.room.id}`)
        } else {
          this.logPlayerOut(player)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e,currentPlayer, 'roomcastPveFight')
      if (success) {
        this.roomcastPveFight(pveData)
      }
    }
  }

  public roomcastItemDrop(itemData: any, roomId: number, y: number, x: number): void {
    let currentPlayer = null
    try{
      const room = this.map.getRoomById(roomId)
      
      for (const player of room.players) {
        currentPlayer = player
        if (!player.clientWs.isClosed) {
          player.clientWs.send(`${Command.ItemDrop},`+
          `${itemData.id},` +
          `${itemData.itemId},`+
          `${roomId},` +
          `${x},${y}`)
        } else {
          this.logPlayerOut(player)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastItemDrop')
      if (success) {
        this.roomcastItemDrop(itemData,roomId,y,x)
      }
    }
  }

  public roomcastItemPick(roomId: number, y: number, x: number, itemId: Items, coins: number, playerId: string): void {
    let currentPlayer = null
    try{
      const room = this.map.getRoomById(roomId)

      for (const player of room.players) {
        currentPlayer = player
        if (!player.clientWs.isClosed) {
          player.clientWs.send(`${Command.ItemPick},`+
          `${playerId},`+
          `${itemId},${coins},`+
          `${x},${y}`)
        } else {
          this.logPlayerOut(player)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastItemPick')
      if (success) {
        this.roomcastItemPick(roomId,y,x,itemId,coins,playerId)
      }
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
      this.handleExceptions(e, player, 'switchRooms')
    }
  }

  private roomcastItemsInRoom(room: Room): void {
    let currentPlayer = null
    try{
      const data = JSON.stringify(room.getAllItemsInRoom())

      for (const player of room.players) {
        currentPlayer = player
        if (!player.clientWs.isClosed) {
          player.clientWs.send(`${Command.ItemsInRoom},${data}`)
        } else {
          this.logPlayerOut(player)
        }
      }
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'roomcastItemsInRoom')
    }
  }

  public unicastMessage(player: Player, message: string): void {
    try{
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.Message},${message}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastMessage')
    }
  }

  public unicastItemRemove(player: Player, itemId: Items): void {
    try{
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.ItemRemove},${itemId}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemRemove')
    }
  }

  public unicastItemWear(player: Player, itemId: Items, gearType: GearType): void {
    try{
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.ItemWear},${itemId},${gearType}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemWear')
    }
  }

  public unicastPlayerStats(player: Player): void {
    try{
      const data = player.getStats()
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.Stats},`+
        `${data.hp},${data.maxHp},${data.attack},${data.defense},`+
        `${data.level},${data.xp},${data.xpNeeded}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerStats')
    }
  }

  public unicastDialog(player: Player, dialog: string) {
    try {
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.Dialog},`+
        `"${dialog}"`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastDialog')
    }
  }

  private unicastItemsInRoom(player: Player): void {
    try{
      const data = JSON.stringify(player.currentRoom.getAllItemsInRoom())
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.ItemsInRoom},${player.currentRoomId},${data}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemsInRoom')
    }
  }

  private unicastNpcsInRoom(player: Player): void {
    try{
      const data = JSON.stringify(player.currentRoom.getAllNpcsInRoom())
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.NpcsInRoom},${data}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastNpcsInRoom')
    }
  }

  private unicastItemUse(player: Player, itemId: Items): void {
    try{
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.ItemUse},${itemId}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemUse')
    }
  }

  private unicastPlayerDroped(player: Player, itemId: Items): void {
    try{
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.ItemDroped},${itemId}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDroped')
    }
  }

  private unicastRank(player: Player): void {
    try{
      if (!player.clientWs.isClosed) {
        player.clientWs.send(`${Command.Rank},`+
          `${this.topPlayers[0].name},`+
          `${this.topPlayers[0].level},`+
          `${this.topPlayers[1].name},`+
          `${this.topPlayers[1].level},`+
          `${this.topPlayers[2].name},`+
          `${this.topPlayers[2].level}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastRank')
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

  private handleExceptions(e: Error, player: Player | null, src: string): boolean {
    try {
      console.log(`source: ${src}`)
      console.log(e)
      let success = false
      if (e.name.includes('ConnectionReset')) {
        success = this.removeAllClosedSockets()
      }
      else if (e.name.includes('SyntaxError')) {
        if (!player!.clientWs.isClosed) {
          player!.clientWs.send(`${Command.Error},"An error has occured"`)
        }
        success = this.logPlayerOut(player!)
      }
  
      if (success) {
        console.log('--- FIXED ---')
      }
      return success
    } catch (e) {
      console.log('source: handleExceptions')
      console.log(e)
    }
    return false
  }

  private removeAllClosedSockets(): boolean {
    let success = false
    let currentPlayer = null
    for (const room of this.map.rooms) {
      for (const player of room.players) {
        try {
          currentPlayer = player
          if (player.clientWs.isClosed) {
            this.logPlayerOut(player)
            success = true
          }
        } catch (e) {
          console.log('source: removeAllClosedSockets')
          console.log(e)
        }
      }
    }

    return success
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

  private checkNameDuplicate(name: string, player: Player): boolean {
    try {
      let nameExists = this.playerNames.some(pName => pName == name)
      if (nameExists) {
        player.clientWs?.send(`${Command.Error},"Name already exists"`)
        return true
      }
      return false
    } catch (e) {
      this.handleExceptions(e, player, 'checkNameDuplicate')
    }
    return false
  }

  private logPlayerOut(player: Player): boolean {
    try{
      const room = this.map.getRoomById(player.currentRoom.id)
      room.removePlayer(player)
      this.playerNames = this.playerNames.filter(e => e !== player.name);
      if (!player.clientWs.isClosed) {
        player.clientWs?.close()
      }
      return true
    } catch (e) {
      this.handleExceptions(e, player, 'logPlayerOut')
    }
    return false
  }

  private pong(player: Player): void {
    try {
      if (!player.clientWs.isClosed) {
        player.clientWs?.send(`${Command.Pong}`)
      } else {
        this.logPlayerOut(player)
      }
    } catch (e) {
      console.log('source: pong')
      console.log(e)
    }
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
    try {
      let duplicatedName = false
      const initialRoom = this.map.rooms[0]
      const playerId = v4.generate()
      const player = new Player(playerId, '', '', 0, 0, initialRoom, this.boardRows, this.boardColumns, ws, this)

      initialRoom.addPlayer(player)
    
      for await (const event of ws) {
        const eventDataString = event as string

        if (isWebSocketCloseEvent(event)) {
          this.logPlayerOut(player)
          this.broadcastPlayerConnection(playerId)
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
              duplicatedName = this.checkNameDuplicate(eventData[1], player)
              if (duplicatedName) {
                initialRoom.removePlayer(player)
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
            this.logPlayerOut(player)
            break
          }

        } catch(e) {
          this.handleExceptions(e,player, 'main loop')
        }
      }
    } catch (e) {
      console.log('source: main loop')
      console.log(e)
    }
  }
}