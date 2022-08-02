import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'

export default class Cow extends NpcBase {
    constructor() {
        super(Npcs.Cow, false, 'cow', 0, 0, 0, 0, 1000, 0.25, 0, 36, null, [], null)
    }
}