import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import WoodenDagger from '../items/woodenDagger.ts'

export default class Bee extends NpcBase {
    constructor() {
        super(Npcs.Bee, true, 'bee', 0, 0, 0, 5, 10000, 0.45, 8, 36, null, [new WoodenDagger(0.2),new Coffee(0.4)], null)
    }
}