import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/consumable/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'
import WoodenSword from '../items/woodenDagger.ts'

export default class ImpMeelee extends NpcBase {
    constructor() {
        super(Npcs.ImpMeelee, true, 'imp meelee', 0, 0, 0, 4, 10000, 0.35, 6, 24, null, [new WoodenDagger(0.3),new WoodenSword(0.2),new Coffee(0.4)], null)
    }
}