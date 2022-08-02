import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import BronzeDagger from '../items/bronzeDagger.ts'
import BronzeArmour from "../items/bronzeArmour.ts"
import SmallHp from "../items/consumable/smallHp.ts"

export default class Goblin3 extends NpcBase {
    constructor() {
        super(Npcs.Goblin3, true, 'goblin', 0, 0, 0, 10, 10000, 0.25, 6, 36, null, [new BronzeArmour(0.2),new BronzeDagger(0.2),new SmallHp(0.4)], null)
    }
}