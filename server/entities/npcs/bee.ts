import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import Bread from '../items/consumable/bread.ts'
import WoodenDagger from '../items/woodenDagger.ts'

export default class Bee extends NpcBase {
    constructor() {
        super(Npcs.Bee, true, 'bee', 0, 0, 0, 2, 10000, 0.45, 8, 36, null, [new WoodenDagger(0.2),new Bread(0.4)], null)
    }
}