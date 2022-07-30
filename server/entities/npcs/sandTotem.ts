import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import AdamantLegs from '../items/adamantLegs.ts'
import AdamantHelm from '../items/adamantHelm.ts'
import BluriteArmour from '../items/bluriteArmour.ts'
import LargeHp from "../items/consumable/largeHp.ts"

export default class SandTotem extends NpcBase {
    constructor() {
        super(Npcs.SandTotem, true, 'sandtotem', 0, 0, 0, 50, 10000, 0.25, 6, 36, null, [new LargeHp(0.4), new AdamantLegs(0.4), new AdamantHelm(0.4), new BluriteArmour(0.7)], null)
    }
}