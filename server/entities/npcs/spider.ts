import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'

export default class Spider extends NpcBase {
    constructor() {
        super(Npcs.Spider, true, 'spider', 0, 0, 0, 1, 10000, 0.25, 6, 36, null, [new WoodenDagger(0.2),new Coffee(0.4)], null)
    }
}