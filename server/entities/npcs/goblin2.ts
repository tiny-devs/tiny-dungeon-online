import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import BronzeHelm from '../items/bronzeHelm.ts'
import WoodenSword from '../items/woodenSword.ts'

export default class Goblin2 extends NpcBase {
    constructor() {
        super(Npcs.Goblin2, true, 'goblin', 0, 0, 0, 10, 10000, 0.25, 6, 36, null, [new WoodenSword(0.5), new BronzeHelm(0.2),new Coffee(0.4)], null)
    }
}