import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import EdwardDialog from '../../dialogs/edwardDialog.ts'

export default class MageEdward extends NpcBase {
    constructor() {
        super(Npcs.Wizard1, false, 'edward', 0, 0, 0, 0, 1000, 0.05, 0, 36, new EdwardDialog(), [], null)
    }
}