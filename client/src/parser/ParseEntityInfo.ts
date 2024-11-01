import { ItemsIds } from '../../../shared/Enums'

export class ParseEntityInfo {
    public name: string
    public level: number
    public attack: number
    public defense: number
    public npcId: number
    public items: string[]
    public isNpc: boolean
    public isItem: boolean
    public itemType: number
    public healthRefuel: number

    constructor(data: string) {
        const entityInfoData = this.parseString(data)

        this.isItem = entityInfoData[1] == '-1'
        if (this.isItem) {
            this.name = ItemsIds[Number(entityInfoData[2])]
            this.level = Number(entityInfoData[3])
            this.attack = Number(entityInfoData[4])
            this.defense = Number(entityInfoData[5])
            this.npcId = Number(entityInfoData[2])
            this.isNpc = false
            this.items = []
            this.itemType = Number(entityInfoData[6])
            this.healthRefuel = Number(entityInfoData[7])
        } else {
            this.name = entityInfoData[1]
            this.level = Number(entityInfoData[2])
            this.attack = Number(entityInfoData[3])
            this.defense = Number(entityInfoData[4])
            this.npcId = Number(entityInfoData[5])
            this.isNpc = Number(entityInfoData[6]) === 1
            this.items = entityInfoData.map(x => ItemsIds[Number(x)]).slice(7)
            this.itemType = 0
            this.healthRefuel = 0
        }
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',').filter(x => x !== '')
    }
}
