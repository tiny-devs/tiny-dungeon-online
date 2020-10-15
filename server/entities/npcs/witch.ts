import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'
import WoodenSword from '../items/woodenDagger.ts'
import WoodenHelm from '../items/woodenHelm.ts'

export default class Witch extends NpcBase {
    constructor() {
        super(Npcs.Witch, true, 'witch', 0, 0, 0, 10, 10000, 0.25, 5, 36, null, [new WoodenDagger(0.3),new WoodenSword(0.3),new WoodenHelm(0.4),new Coffee(0.4)], null)
    }
}