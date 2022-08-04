import { ItemsIds } from '../../../shared/Enums'

export class ParseEntityInfo {
    public name: string
    public level: number
    public attack: number
    public defense: number
    public npcId: number
    public items: string[]
    public isNpc: boolean

    constructor(data: string) {
        const entityInfoData = this.parseString(data)

        this.name = entityInfoData[1]
        this.level = Number(entityInfoData[2])
        this.attack = Number(entityInfoData[3])
        this.defense = Number(entityInfoData[4])
        this.npcId = Number(entityInfoData[5])
        this.isNpc = Number(entityInfoData[6]) === 1
        this.items = entityInfoData.map(x => ItemsIds[Number(x)]).slice(7)
    }

    private parseString(eventDataString: string) {
        return eventDataString.split(',').filter(x => x !== '')
    }
}
