import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'

export default class Horse2 extends NpcBase {
    constructor() {
        super(Npcs.Horse2, false, 'horse2', 0, 0, 0, 0, 1000, 0.25, 0, 36, null, [], null)
    }
}