import { ItemsIds } from "../models/Enums"

export class ParseLoad {
    public id: string
    public hp: number
    public maxHp: number
    public attack: number
    public defense: number
    public level: number
    public xp: number
    public xpNeeded: number
    public gameVersion: number
    public itemsIds: ItemsIds[]
    public gearHead: ItemsIds | null
    public gearTorso: ItemsIds | null
    public gearLegs: ItemsIds | null
    public gearWeapon: ItemsIds | null

    constructor(data: string) {
        const parsedData = this.parseString(data)

        this.id = parsedData[0][1]
        this.hp = +parsedData[0][2]
        this.maxHp = +parsedData[0][3]
        this.attack = +parsedData[0][4]
        this.defense = +parsedData[0][5]
        this.level = +parsedData[0][6]
        this.xp = +parsedData[0][7]
        this.xpNeeded = +parsedData[0][8]
        this.gameVersion = +parsedData[0][9]

        this.itemsIds = parsedData[1]

        if (parsedData[2][0] != -1) {
            this.gearHead = parsedData[2][0]
        } else {
            this.gearHead = null
        }
        if (parsedData[2][1] != -1) {
            this.gearTorso = parsedData[2][1]
        } else {
            this.gearTorso = null
        }
        if (parsedData[2][2] != -1) {
            this.gearLegs = parsedData[2][2]
        } else {
            this.gearLegs = null
        }
        if (parsedData[2][3] != -1) {
            this.gearWeapon = parsedData[2][3]
        } else {
            this.gearWeapon = null
        }
    }

    private parseString(eventDataString: string): any[][] {
        const allData = eventDataString.split('@')

        const statsData = allData[0].split(',')

        let itemsData = []
        if (allData[1]) {
            const itemsDataStrings = allData[1].split(',')
            for (const itemId of itemsDataStrings) {
                if (itemId != '') {
                    itemsData.push(+itemId)
                }
            }
        }

        let gearData = []
        if (allData[2]) {
            for (let i=2; i<6;i++) {
                if (allData[i] != 'empty') {
                    gearData.push(+allData[i])
                } else {
                    gearData.push(-1)
                }
            }
        }

        return [statsData,itemsData,gearData]
    }
}