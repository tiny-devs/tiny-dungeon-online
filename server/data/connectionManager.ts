//import { Client } from "../../deps.ts";

enum LastActionEnum {
    None,
    GetRank,
    UpdateRank,
    SaveAccount
}

export default class ConnectionManager {
    public client: any
    public isConnected = false
    private lastAction: LastActionEnum = LastActionEnum.None
    private currentRankData: {id:string,name:string,level:number}[] = []
    private currentAccount: {id:string,data:string} = {id:'',data:''}
    private reconnectAttempts = 0
    private hostname = ''
    private username = ''
    private dbname = ''
    private password = ''

    constructor() {
        // this.client = new Client()
        // this.parseConnectionString()
        // this.connect()
    }

    public async saveAccount(account: {id:string,data:string}) {
        try {
            this.currentAccount = account

            const exists = await this.client.query(`select * from tinyaccount where PlayerId = ${account.id}`);
            if (exists) {
                await this.client.execute(
                    `update tinyaccount set ?? = ? where PlayerId = ${account.id}`,
                    ["PlayerData", account.data]);
            } else {
                await this.client.execute(
                    `insert into tinyaccount (PlayerId,PlayerData) VALUES (?,?)`,
                    [account.id, account.data]);
            }
            
        } catch (e) {
            if (!e.message.includes('Unconnected')) {
                //this.client.close()
                this.isConnected = false
                console.log(`(saveAccount) DB error:`)
                console.log(e)
                
                const dbAvailable = !e.name.includes('AddrNotAvailable') && !e.message.includes('Unknown')
                if (dbAvailable) {
                    this.lastAction = LastActionEnum.SaveAccount
                    //this.reconnect()
                }
            }
        }
    }

    public async getRank(): Promise<{id:string,name:string,level:number}[]> {
        try {
            const players = await this.client.query(`select * from tinyrank`);
            const result = []
            for(const player of players) {
                result.push({id:player.PlayerId,name:player.PlayerName,level:player.PlayerLevel})
            }
    
            return result
        } catch (e) {
            //this.client.close()
            this.isConnected = false
            const result = []
            result.push({id:'',name:'',level:0})
            result.push({id:'',name:'',level:0})
            result.push({id:'',name:'',level:0})

            console.log(`(getRank) DB error:`)
            console.log(e)

            const dbAvailable = !e.name.includes('AddrNotAvailable') && !e.message.includes('Unknown')
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

            // await this.client.execute(
            //     `update tinyrank set ?? = ?, ?? = ?, ?? = ? where Id = 0`,
            //     ["PlayerId", topPlayers[0].id,
            //     "PlayerName", topPlayers[0].name,
            //     "PlayerLevel", topPlayers[0].level]);
            // await this.client.execute(
            //     `update tinyrank set ?? = ?, ?? = ?, ?? = ? where Id = 1`,
            //     ["PlayerId", topPlayers[1].id,
            //     "PlayerName", topPlayers[1].name,
            //     "PlayerLevel", topPlayers[1].level]);
            // await this.client.execute(
            //     `update tinyrank set ?? = ?, ?? = ?, ?? = ? where Id = 2`,
            //     ["PlayerId", topPlayers[2].id,
            //     "PlayerName", topPlayers[2].name,
            //     "PlayerLevel", topPlayers[2].level]);
        } catch (e) {
            if (!e.message.includes('Unconnected')) {
                //this.client.close()
                this.isConnected = false
                console.log(`(updateRank) DB error:`)
                console.log(e)
    
                const dbAvailable = !e.name.includes('AddrNotAvailable') && !e.message.includes('Unknown')
                if (dbAvailable) {
                    this.lastAction = LastActionEnum.UpdateRank
                    //this.reconnect()
                }
            }
        }
    }

    public async connect() {
        try {
            console.log(`trying to connect: ${this.hostname}...`)
            await this.client.connect({
                hostname: this.hostname,
                username: this.username,
                db: this.dbname,
                password: this.password,
            });

            if (this.client.pool?.available) {
                this.isConnected = true
                console.log(`connected!`)
            }
        } catch (e) {
            this.isConnected = false
            console.log(`not connected`)
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

    private reconnect() {
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
                if (this.lastAction == LastActionEnum.SaveAccount) {
                    this.saveAccount(this.currentAccount)
                }
            }
        },5000)
    }
}