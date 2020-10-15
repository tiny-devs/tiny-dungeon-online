import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'
import Coffee from '../items/coffee.ts'
import BronzeDagger from '../items/bronzeDagger.ts'

export default class Goblin3 extends NpcBase {
    constructor() {
        super(Npcs.Goblin3, true, 'goblin3', 0, 0, 0, 10, 10000, 0.25, 6, 36, null, [new BronzeDagger(0.1),new Coffee(0.4)], null)
    }
}