import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import FireLegs from '../items/fireLegs.ts'
import FireDagger from '../items/fireDagger.ts'
import FireSword from '../items/fireSword.ts'
import LargeHp from "../items/consumable/largeHp.ts"

export default class Demon2 extends NpcBase {
    constructor() {
        super(Npcs.Demon2, true, 'demon', 0, 5, 5, 75, 10000, 0.25, 8, 36, null, [new FireDagger(0.5), new FireLegs(0.6), new FireSword(0.5), new LargeHp(0.7)], null)
    }
}