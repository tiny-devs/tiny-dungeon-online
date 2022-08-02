import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'

export default class Camel extends NpcBase {
    constructor() {
        super(Npcs.Camel, false, 'camel', 0, 0, 0, 0, 1000, 0.25, 0, 36, null, [], null)
    }
}