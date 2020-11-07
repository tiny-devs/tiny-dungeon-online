import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Player } from './entities/player.ts'
import { Command, Direction, Items, GearType } from './Enums.ts'
import Room from './map/rooms/room.ts'
import Map from './map/map.ts'
import { Npc } from './entities/npc.ts'
import { PveData } from './pve/pveData.ts'
import ConnectionManager from "./data/connectionManager.ts"
import DataManager from "./data/dataManager.ts"

export class ClientHandler {
  public boardColumns: number = 16
  public boardRows: number = 16
  public playerNames: string[] = []
  public map: Map
  private topPlayers: {id:string,name:string,level:number}[]
  private db: ConnectionManager
  private playerDataManager: DataManager

  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns

    this.map = new Map(this)

    this.playerDataManager = new DataManager()

    this.db = new ConnectionManager()
    this.topPlayers = []
     this.db.getRank().then(result => {
      this.topPlayers = result
    })
  }

  private broadcastRank(): void {
    let currentPlayer = null
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          this.send(player,`${Command.Rank},`+
            `${this.topPlayers[0].name},`+
            `${this.topPlayers[0].level},`+
            `${this.topPlayers[1].name},`+
            `${this.topPlayers[1].level},`+
            `${this.topPlayers[2].name},`+
            `${this.topPlayers[2].level}`)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastRank')
      if (success) {
        this.broadcastRank()
      }
    }
  }

  private broadcastPlayerIdUpdate(newId: string, oldId: string): void {
    let currentPlayer = null
    try{
      for (const room of this.map.rooms) {
        for (const player of room.players) {
          currentPlayer = player
          this.send(player,`${Command.UpdatePlayerId},${oldId},${newId}`)
        }
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'broadcastPlayerConnection')
      if (success) {
        this.broadcastPlayerIdUpdate(newId,oldId)
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
          this.send(player,`${Command.Login},`+
            `${playerId},`+
            `${this.boardRows},`+
            `${this.boardColumns},`+
            `${data}`)
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
            this.send(player,`${Command.Move},`+
              `${playerMoved.id},`+
              `${playerMoved.x},`+
              `${playerMoved.y},`+
              `${playerMoved.currentRoomId}`)
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
        this.send(player,`${Command.NpcMove},`+
          `${npcMoved.id},` +
          `${npcMoved.npcId},`+
          `${npcMoved.x},`+
          `${npcMoved.y},` +
          `${npcMoved.roomId}`)
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
        this.send(player,`${Command.Pve},`+
          `${pveData.attacker},` +
          `${pveData.damageCaused},`+
          `${pveData.npc.hp},` +
          `${pveData.npc.id},` +
          `${pveData.player.hp},` +
          `${pveData.player.id},` +
          `${pveData.room.id}`)
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
        this.send(player,`${Command.ItemDrop},`+
          `${itemData.id},` +
          `${itemData.itemId},`+
          `${roomId},` +
          `${x},${y}`)
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
        this.send(player,`${Command.ItemPick},`+
          `${playerId},`+
          `${itemId},${coins},`+
          `${x},${y}`)
      }
    } catch (e) {
      const success = this.handleExceptions(e, currentPlayer, 'roomcastItemPick')
      if (success) {
        this.roomcastItemPick(roomId,y,x,itemId,coins,playerId)
      }
    }
  }

  private roomcastChat(room: Room, playerId: string, message: string): void {
    let currentPlayer = null
    try{
      for (const player of room.players) {
        currentPlayer = player
        this.send(player,`${Command.Chat},${playerId},"${message}"`)
      }
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'roomcastItemsInRoom')
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
        this.send(player,`${Command.ItemsInRoom},${data}`)
      }
    } catch (e) {
      this.handleExceptions(e, currentPlayer, 'roomcastItemsInRoom')
    }
  }

  public unicastMessage(player: Player, message: string): void {
    try{
      this.send(player,`${Command.Message},${message}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastMessage')
    }
  }

  public unicastItemRemove(player: Player, itemId: Items): void {
    try{
      this.send(player,`${Command.ItemRemove},${itemId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemRemove')
    }
  }

  public unicastItemWear(player: Player, itemId: Items, gearType: GearType): void {
    try{
      this.send(player,`${Command.ItemWear},${itemId},${gearType}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemWear')
    }
  }

  public unicastPlayerStats(player: Player): void {
    try{
      const data = player.getStats()
      this.send(player,`${Command.Stats},`+
        `${data.hp},${data.maxHp},${data.attack},${data.defense},`+
        `${data.level},${data.xp},${data.xpNeeded}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerStats')
    }
  }

  public unicastDialog(player: Player, dialog: string) {
    try {
      this.send(player,`${Command.Dialog},"${dialog}"`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastDialog')
    }
  }

  private unicastItemsInRoom(player: Player): void {
    try{
      const data = JSON.stringify(player.currentRoom.getAllItemsInRoom())
      this.send(player,`${Command.ItemsInRoom},${player.currentRoomId},${data}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemsInRoom')
    }
  }

  private unicastNpcsInRoom(player: Player): void {
    try{
      const data = JSON.stringify(player.currentRoom.getAllNpcsInRoom())
      this.send(player,`${Command.NpcsInRoom},${data}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastNpcsInRoom')
    }
  }

  private unicastItemUse(player: Player, itemId: Items): void {
    try{
      this.send(player,`${Command.ItemUse},${itemId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastItemUse')
    }
  }

  private unicastPlayerDroped(player: Player, itemId: Items): void {
    try{
      this.send(player,`${Command.ItemDroped},${itemId}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDroped')
    }
  }

  private unicastRank(player: Player): void {
    try{
      this.send(player,`${Command.Rank},`+
        `${this.topPlayers[0].name},`+
        `${this.topPlayers[0].level},`+
        `${this.topPlayers[1].name},`+
        `${this.topPlayers[1].level},`+
        `${this.topPlayers[2].name},`+
        `${this.topPlayers[2].level}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastRank')
    }
  }

  public async unicastPlayerDataHashSave(player: Player) {
    try{
      const playerDataHash = await this.playerDataManager.encryptUserData(player.getPlayerDataForSave())
      this.send(player,`${Command.Save},${playerDataHash}`)
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDataHashSave')
    }
  }

  private async unicastPlayerDataLoaded(player: Player, dataHash: string) {
    try{
      const success = await this.loadPlayerDataFromHash(player, dataHash)
      if (!success) {
        this.send(player,`${Command.EraseSave}`)
      } else {
        let data = `${Command.Load},${player.id},`+
        `${player.hp},${player.totalHp()},${player.totalAttack()},${player.totalDefense()},`+
        `${player.level},${player.xp},${player.xpNeeded}@`
        for (const item of player.bag.items) {
          data += `${item.itemId},`
        }
        data += '@'
        if (player.gear.head) {
          data += `${player.gear.head.itemId}@`
        } else {
          data += 'empty@'
        }
        if (player.gear.torso) {
          data += `${player.gear.torso.itemId}@`
        } else {
          data += 'empty@'
        }
        if (player.gear.legs) {
          data += `${player.gear.legs.itemId}@`
        } else {
          data += 'empty@'
        }
        if (player.gear.weapon) {
          data += `${player.gear.weapon.itemId}`
        } else {
          data += 'empty'
        }
  
        this.send(player,data)
      }
    } catch (e) {
      this.handleExceptions(e, player, 'unicastPlayerDataLoaded')
    }
  }

  private async loadPlayerDataFromHash(player: Player, dataHash: string): Promise<boolean> {
    try{
      const data = await this.playerDataManager.decryptUserData(dataHash)
      return player.loadPlayerDataFromSave(data)
    } catch (e) {
      this.handleExceptions(e, player, 'loadPlayerDataFromHash')
      return false
    }
  }

  private async unicastPlayerExit(player: Player) {
    try{
      const playerDataHash = await this.playerDataManager.encryptUserData(player.getPlayerDataForSave())
      this.send(player,`${Command.Exit},${playerDataHash}`)
    } catch (e) {
      this.handleExceptions(e, player, 'loadPlayerDataFromHash')
    }
  }

  public updateRank() {
    let updated = false
    let players = [] as any[]
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
      const topPlayer = this.topPlayers.find(p => p.id == players[i].id)
      if (!topPlayer) {
        this.topPlayers.push({id:players[i].id,name:players[i].name,level:players[i].level})
        updated = true
      } else {
        if (topPlayer.level != players[i].level) {
          const index = this.topPlayers.map(p => p.id).indexOf(players[i].id)
          this.topPlayers[index].level = players[i].level
          updated = true
        }
      }
    }

    this.topPlayers.sort((a, b) => { 
      return b.level - a.level;
    })

    players.splice(0, players.length)
    if (updated) {
      this.topPlayers.splice(3)
      this.db.updateRank(this.topPlayers).then(() => {
        this.broadcastRank()
      })
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
        this.send(player!,`${Command.Error},"An error has occured"`)
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
      return this.playerNames.some(pName => pName == name)
    } catch (e) {
      this.handleExceptions(e, player, 'checkNameDuplicate')
    }
    return false
  }

  private checkPlayerAlreadyLogged(player: Player, id: string): boolean {
    try {
      const players = this.getAllPlayers()
      return players.filter(p => p.id == id).length > 1
    } catch (e) {
      this.handleExceptions(e, player, 'checkNameDuplicate')
    }
    return false
  }

  private unicastError(player: Player, description: string): boolean {
    try {
      this.send(player, `${Command.Error},"${description}"`)
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
      this.send(player,`${Command.Pong}`)
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

    if (eventDataString.includes(',"')) {
      const indexFirstQuotes = eventDataString.indexOf(',"')+2
      const indexLastQuotes = eventDataString.split(',"')[1].indexOf('"')+indexFirstQuotes
      eventData[1] = eventDataString.substring(indexFirstQuotes, indexLastQuotes)
    }

    return eventData
  }

  private send(player: Player, message: string):boolean {
    try {
      if (!player.clientWs.isClosed) {
        player.clientWs.send(message)
        return true
      } else {
        this.logPlayerOut(player)
        return false
      }
    } catch (e) {
      console.log('source: send')
      console.log(e)
    }
    return false
  }

  public async handleClient(ws: WebSocket): Promise<void> {
    try {
      let exit = false
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
            case Command.Chat:
              if (eventData[1].length <= 40 && player.canChat) {
                this.roomcastChat(player.currentRoom, player.id, eventData[1])
                player.startChatTimeout()
              }
              break
            case Command.Move:
              this.broadcastPlayerMove(player, +eventData[1])
              break
            case Command.Login:
              duplicatedName = this.checkNameDuplicate(eventData[1], player)
              if (duplicatedName) {
                this.unicastError(player, "Name already exists")
                initialRoom.removePlayer(player)
                break
              }

              this.playerNames.push(eventData[1])
              player.name = eventData[1]
              player.color = eventData[2]
              player.matrix = JSON.parse(eventData[4])

              this.broadcastPlayerConnection(playerId)
              this.unicastNpcsInRoom(player)
              this.unicastItemsInRoom(player)

              const playerLoadData = eventData[3]
              const hasPlayerData = playerLoadData != '0'
              if (hasPlayerData) {
                const oldId = player.id
                await this.unicastPlayerDataLoaded(player,playerLoadData)
                this.broadcastPlayerIdUpdate(player.id, oldId)
                const isPlayerAlreadyLogged = this.checkPlayerAlreadyLogged(player, player.id)
                if (isPlayerAlreadyLogged) {
                  this.unicastError(player, "Player already logged")
                  exit = true
                }
              } else {
                this.unicastPlayerStats(player)
              }
              const updatedRank = this.updateRank()
              if (!updatedRank) {
                this.unicastRank(player)
              }
              player.savePlayer()
              break
            case Command.Exit:
              exit = true
              await this.unicastPlayerExit(player)
              break
            case Command.Ping:
              this.pong(player)
              break
          }

          if (duplicatedName) {
            this.logPlayerOut(player)
            break
          }

          if (exit) {
            this.logPlayerOut(player)
            this.broadcastPlayerConnection(playerId)
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