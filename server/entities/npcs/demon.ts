import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import FireHelm from '../items/fireHelm.ts'
import FireArmour from '../items/fireArmour.ts'

export default class Demon extends NpcBase {
    constructor() {
        super(Npcs.Demon, true, 'demon', 0, 5, 0, 75, 10000, 0.25, 6, 36, null, [new FireArmour(0.4), new FireHelm(0.5)], null)
    }
}