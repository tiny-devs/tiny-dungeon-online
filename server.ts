import { listenAndServe } from 'https://deno.land/std/http/server.ts'
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts'
import * as flags from 'https://deno.land/std@v0.50.0/flags/mod.ts'
import { ClientHandler } from './server/clientHandler.ts'

export class Server {
  private argPort: number = flags.parse(Deno.args).port
  private port: number
  private clientHandler: ClientHandler;

  constructor(serverConfigs: any) {
    this.port = this.argPort ? Number(this.argPort) : serverConfigs.defaultPort
    this.clientHandler = new ClientHandler(serverConfigs);
  }

  public init(): void {
    listenAndServe({ port: this.port }, async (req) => {
      if (req.method === 'GET' && req.url === '/') {
        req.respond({
          status: 200,
          headers: new Headers({
            'content-type': 'text/html',
          }),
          body: await Deno.open('./client/index.html'),
        })
      }

      const publicFiles = [
        'board/Board.js',
        'board/layers/BackgroundLayer.js',
        'board/layers/SolidLayer.js',
        'board/layers/SpritesLayer.js',
        'board/map/tiles/Color.js',
        'board/map/tiles/Tile.js',
        'board/map/tiles/Tiles.js',
        'board/map/InitialRoom.js',
        'drawingCanvas/DrawingCanvas.js',
        'drawingCanvas/DrawingGrid.js',
        'entities/Player.js',
        'parser/ParseLogin.js',
        'parser/ParseMove.js',
        'parser/Parser.js',
        'Client.js',
        'Enums.js',
        'Game.js',
        'Main.js'
      ];

      publicFiles.map(async file => {
        if (req.method === 'GET' && req.url === '/js/' + file) {
          req.respond({
            status: 200,
            headers: new Headers({
              'content-type': 'application/javascript',
            }),
            body: await Deno.open('./client/js/' + file),
          })
        }
      })

      if (req.method === 'GET' && req.url === '/ws') {
        if (acceptable(req)) {
          acceptWebSocket({
            conn: req.conn,
            bufReader: req.r,
            bufWriter: req.w,
            headers: req.headers,
          }).then(this.clientHandler.handleClient.bind(this.clientHandler))
        }
      }
    })

    console.log(`Server running on localhost:${this.port}`)
  }
}