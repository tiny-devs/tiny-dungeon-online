import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import AdamantHelm from '../items/adamantHelm.ts'
import CactusJuice from '../items/consumable/cactusJuice.ts'
import SmallHp from "../items/consumable/smallHp.ts"

export default class CursedCactus extends NpcBase {
    constructor() {
        super(Npcs.CursedCactus, true, 'cursedcactus', 0, 0, 0, 40, 10000, 0.25, 6, 36, null, [new CactusJuice(0.1), new AdamantHelm(0.15), new SmallHp(0.5)], null)
    }
}