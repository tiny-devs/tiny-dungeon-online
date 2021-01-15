import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import FireLegs from '../items/fireLegs.ts'
import FireDagger from '../items/fireDagger.ts'
import FireSword from '../items/fireSword.ts'

export default class Demon2 extends NpcBase {
    constructor() {
        super(Npcs.Demon2, true, 'demon', 0, 5, 0, 75, 10000, 0.25, 6, 36, null, [new FireDagger(0.6), new FireLegs(0.7), new FireSword(0.6)], null)
    }
}