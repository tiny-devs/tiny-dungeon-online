import { Npcs } from '../../Enums.ts'
import NpcBase from './npcBase.ts'

export default class Dog extends NpcBase {
    constructor() {
        super(Npcs.Dog, false, 0, 0, 0, 0, 1000, 0.25, 0, 36, [])
    }
}