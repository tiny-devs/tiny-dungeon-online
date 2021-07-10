import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

enum LastActionEnum {
    None,
    GetRank,
    UpdateRank
}

export default class ConnectionManager {
    public client: Client
    public isConnected: boolean = false
    private lastAction: LastActionEnum = LastActionEnum.None
    private currentRankData: {id:string,name:string,level:number}[] = []
    private reconnectAttempts: number = 0
    private hostname: string = ''
    private username: string = ''
    private dbname: string = ''
    private password: string = ''

    constructor() {
        this.client = new Client()
        this.parseConnectionString()
        this.connect()
    }

    public async getRank(): Promise<{id:string,name:string,level:number}[]> {
        try {
            const players = await this.client.query(`select * from tinyrank`);
            let result = []
            for(const player of players) {
                result.push({id:player.PlayerId,name:player.PlayerName,level:player.PlayerLevel})
            }
    
            return result
        } catch (e) {
            this.client.close()
            this.isConnected = false
            let result = []
            result.push({id:'',name:'',level:0})
            result.push({id:'',name:'',level:0})
            result.push({id:'',name:'',level:0})

            console.log(`DB error:`)
            console.log(e)

            const dbAvailable = !e.name.includes('AddrNotAvailable')
            if (dbAvailable) {
                this.lastAction = LastActionEnum.GetRank
                this.reconnect()
            }
            return result
        }
    }

    public async updateRank(topPlayers: {id:string,name:string,level:number}[]) {
        try {
            this.currentRankData = topPlayers

            await this.client.execute(
                `update tinyrank set ?? = ?, ?? = ?, ?? = ? where Id = 0`,
                ["PlayerId", topPlayers[0].id,
                "PlayerName", topPlayers[0].name,
                "PlayerLevel", topPlayers[0].level]);
            await this.client.execute(
                `update tinyrank set ?? = ?, ?? = ?, ?? = ? where Id = 1`,
                ["PlayerId", topPlayers[1].id,
                "PlayerName", topPlayers[1].name,
                "PlayerLevel", topPlayers[1].level]);
            await this.client.execute(
                `update tinyrank set ?? = ?, ?? = ?, ?? = ? where Id = 2`,
                ["PlayerId", topPlayers[2].id,
                "PlayerName", topPlayers[2].name,
                "PlayerLevel", topPlayers[2].level]);
        } catch (e) {
            if (!e.message.includes('Unconnected')) {
                this.client.close()
                this.isConnected = false
                console.log(`DB error:`)
                console.log(e)
    
                const dbAvailable = !e.name.includes('AddrNotAvailable')
                if (dbAvailable) {
                    this.lastAction = LastActionEnum.UpdateRank
                    this.reconnect()
                }
            }
        }
    }

    public async connect() {
        try {
            await this.client.connect({
                hostname: this.hostname,
                username: this.username,
                db: this.dbname,
                password: this.password,
            });

            if (this.client.pool?.available) {
                this.isConnected = true
            }
        } catch (e) {
            this.isConnected = false
            console.log(e)
        }
    }

    private parseConnectionString() {
        const connectionString = Deno.env.get('tinyconnectionstring')
        if (connectionString) {
            const variables = connectionString.split(';')

            this.hostname = variables[0]
            this.username = variables[1]
            this.dbname = variables[2]
            this.password = variables[3]
        } else {
            this.isConnected = false
            console.log(`error getting env: ${Deno.env.get('tinyconnectionstring')}`)
        }
    }

    private async reconnect() {
        console.log(`retrying connection: ${this.reconnectAttempts + 1}`)
        setTimeout(async ()=>{
            await this.connect()
            if (!this.isConnected) {
                this.reconnectAttempts += 1
                if (this.reconnectAttempts < 5) {
                    this.reconnect()
                } else {
                    console.log('unable to reach db')
                }
            } else {
                this.reconnectAttempts = 0
                console.log('reconnected to db!')
                if (this.lastAction == LastActionEnum.UpdateRank) {
                    this.updateRank(this.currentRankData)
                }
            }
        },5000)
    }
}