import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import AdamantHelm from '../items/adamantHelm.ts'
import AdamantSword from '../items/adamantSword.ts'
import LargeHp from '../items/consumable/largeHp.ts'

export default class AdamantGhost extends NpcBase {
    constructor() {
        super(Npcs.AdamantGhost, true, 'adamantghost', 0, 0, 0, 40, 10000, 0.25, 6, 36, null, [new AdamantHelm(0.2), new AdamantSword(0.5), new LargeHp(0.5)], null)
    }
}