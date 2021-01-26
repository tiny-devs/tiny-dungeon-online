import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import BronzeDagger from '../items/bronzeDagger.ts'
import WoodenArmour from '../items/woodenArmour.ts'
import SmallHp from "../items/consumable/smallHp.ts"

export default class Goblin extends NpcBase {
    constructor() {
        super(Npcs.Goblin, true, 'goblin', 0, 0, 0, 10, 10000, 0.25, 6, 36, null, [new WoodenArmour(0.5),new BronzeDagger(0.2), new Coffee(0.6), new SmallHp(0.6)], null)
    }
}