import { listenAndServe } from 'https://deno.land/std/http/server.ts'
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts'
import * as flags from 'https://deno.land/std@v0.50.0/flags/mod.ts'
import { ClientHandler } from './server/clientHandler.ts'

export class Server {
  private argPort: number = flags.parse(Deno.args).port
  private port: number
  private clientHandler: ClientHandler;
  private publicFolder: string = './client/js'
  private publicFiles: string[] = [];

  constructor(serverConfigs: any) {
    this.port = this.argPort ? Number(this.argPort) : serverConfigs.defaultPort
    this.clientHandler = new ClientHandler(serverConfigs);
  }

  public init(): void {
    this.setPublicFilesList(this.publicFolder)
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

      this.publicFiles.map(async file => {
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

  public setPublicFilesList(path: string): void {
    for (const dirEntry of Deno.readDirSync(path)) {
      if (dirEntry.isDirectory) {
        this.setPublicFilesList(`${path}/${dirEntry.name}`)
      } else {
        let pathToRemove = this.publicFolder
        let outputFile = dirEntry.name
        if (this.publicFolder !== path) {
          pathToRemove += '/'
          outputFile = `/${outputFile}`
        }
        const outputPath = path.replace(`${pathToRemove}`,'')
        this.publicFiles.push(`${outputPath}${outputFile}`)
      }
    }
  }
}