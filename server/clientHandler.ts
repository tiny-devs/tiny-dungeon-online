import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Player } from './player.ts'

export class ClientHandler {
  private boardColumns: number = 5
  private boardRows: number = 5
  public players: Player[] = []


  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns
  }

  private broadcastPlayerMove(player: Player, direction: string): void {
    player.move(direction, this.boardRows, this.boardColumns)

    for (const player of this.players.values()) {
      player.clientWs.send(JSON.stringify(this.players))
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    for (const player of this.players.values()) {
      player.clientWs.send(JSON.stringify({command: 'player-login', data: `> player with the id ${playerId} is connected`}))
    }
  }

  private pong(player: Player): void {
    this.players.filter(p => p.name == player.name)[0];
    player.clientWs?.send('pong');
  }

  public async handleClient(ws: WebSocket): Promise<void> {
    const playerId = v4.generate()
    const player = new Player(playerId, '', '', 0, 0, ws)

    this.players.push(player)
    this.broadcastPlayerConnection(playerId)
  
    for await (const event of ws) {
      const eventDataString = event as string

      if (isWebSocketCloseEvent(event)) {
        const index = this.players.indexOf(player)
        if (index > -1) {
          this.players.splice(index, 1)
        }
        this.broadcastPlayerConnection(playerId)
        break
      }

      try {
        const eventData = JSON.parse(eventDataString)
        
        switch (eventData.command) {
          case 'walk-command':
            this.broadcastPlayerMove(player, eventData.key)
            break
          case 'player-login':
            player.name = eventData.name
            player.color = eventData.color
            break
          case 'ping':
            this.pong(player)
            break
        }

      } catch(e) {
        console.log(e)
      }
      
    }
  }
}