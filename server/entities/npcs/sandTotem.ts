import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import AdamantLegs from '../items/adamantLegs.ts'
import AdamantHelm from '../items/adamantHelm.ts'
import BluriteArmour from '../items/bluriteArmour.ts'

export default class SandTotem extends NpcBase {
    constructor() {
        super(Npcs.SandTotem, true, 'sandtotem', 0, 0, 0, 50, 10000, 0.25, 6, 36, null, [new AdamantLegs(0.4), new AdamantHelm(0.4), new BluriteArmour(0.7)], null)
    }
}