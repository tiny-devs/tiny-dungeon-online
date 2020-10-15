import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'
import WoodenSword from '../items/woodenDagger.ts'

export default class ImpMeelee extends NpcBase {
    constructor() {
        super(Npcs.ImpMeelee, true, 'imp meelee', 0, 0, 0, 5, 10000, 0.35, 6, 24, null, [new WoodenDagger(0.2),new WoodenSword(0.1),new Coffee(0.4)], null)
    }
}