import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import NestorDialog from "../dialogs/nestorDialog.ts"

export default class Nestor extends NpcBase {
    constructor() {
        super(Npcs.MaleGnome, false, 'nestor', 0, 0, 0, 0, 1000, 0.05, 0, 36, new NestorDialog(), [], null)
    }
}