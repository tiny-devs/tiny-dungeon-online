import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts'
import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Player } from './player.ts'
import { Direction } from './Enums/Direction.ts'
import { Command } from './Enums/Command.ts'

export class ClientHandler {
  private boardColumns: number = 5
  private boardRows: number = 5
  public players: Player[] = []


  constructor(serverConfigs: any) {
    this.boardRows = serverConfigs.boardRows
    this.boardColumns = serverConfigs.boardColumns
  }

  private broadcastPlayerMove(playerMoved: Player, direction: Direction): void {
    playerMoved.move(direction, this.boardRows, this.boardColumns)

    for (const player of this.players) {
      player.clientWs.send(`{"command": ${Command.Move},`+
      `"id": "${playerMoved.id}",`+
      `"x":"${playerMoved.x}",`+
      `"y":"${playerMoved.y}"}`)
    }
  }

  private broadcastPlayerConnection(playerId: string): void {
    const data = JSON.stringify(this.players);

    for (const player of this.players) {
      player.clientWs.send(`{"command": ${Command.Login},`+
      `"message": "> player with the id ${playerId} is connected",`+
      `"boardRows":"${this.boardRows}",`+
      `"boardColumns":"${this.boardColumns}",`+
      `"players":${data}}`)
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
          case Command.Move:
            this.broadcastPlayerMove(player, eventData.key)
            break
          case Command.Login:
            player.name = eventData.name
            player.color = eventData.color
            this.broadcastPlayerConnection(playerId)
            break
          case Command.Ping:
            this.pong(player)
            break
        }

      } catch(e) {
        console.log(e)
      }
      
    }
  }
}