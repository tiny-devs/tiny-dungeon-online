import { flags } from "./deps.ts"
import { serve } from "./deps.ts"
import { serveFile } from "./deps.ts"
import { ClientHandler } from "./server/clientHandler.ts"

export class Server {
  private port: string
  private clientHandler: ClientHandler
  private publicFolder = "./client/public"
  private publicFiles: string[] = []

  constructor(serverConfigs: any) {
    const argPort: number = flags.parse(Deno.args).port
    const herokuPort = Deno.env.get("PORT")
    this.port = herokuPort ? Number(herokuPort) : argPort ? Number(argPort) : serverConfigs.defaultPort
    this.clientHandler = new ClientHandler(serverConfigs)
  }

  public async reqHandler(req: Request) {
    if (req.headers.get("upgrade") != "websocket") {
      return await this.handleNonWsRequests(req)
    }
    const { socket: ws, response } = Deno.upgradeWebSocket(req)
    this.clientHandler.handleClient(ws)

    return response
  }

  public init(): void {
    const portInt = Number(this.port)
    this.setPublicFilesList(this.publicFolder)
    serve(this.reqHandler.bind(this), { port: portInt })
  }

  public async handleNonWsRequests(req: Request): Promise<Response> {
    const url = new URL(req.url)
    let cleanedUrl = url.pathname
    let response: Response = new Response()
    if(req.url.includes('?')) {
      cleanedUrl = req.url.split('?')[0]
    }

    if (req.method === "GET" && cleanedUrl === "/") {
      response = await serveFile(req, "./client/public/index.html")
    }

    if (req.method === "GET" && cleanedUrl === "/favicon.ico") {
      response = await serveFile(req, "./client/public/favicon.ico")
    }

    for (const file of this.publicFiles) {
      if (req.method === "GET" && cleanedUrl === `/js/${file}`) {
        response = await serveFile(req, `./client/public/${file}`)
      }
    }

    return response
  }

  public setPublicFilesList(path: string): void {
    for (const dirEntry of Deno.readDirSync(path)) {
      if (dirEntry.isDirectory) {
        this.setPublicFilesList(`${path}/${dirEntry.name}`)
      } else {
        let pathToRemove = this.publicFolder
        let outputFile = dirEntry.name
        if (this.publicFolder !== path) {
          pathToRemove += "/"
          outputFile = `/${outputFile}`
        }
        const outputPath = path.replace(`${pathToRemove}`, "")
        this.publicFiles.push(`${outputPath}${outputFile}`)
      }
    }
  }
}
