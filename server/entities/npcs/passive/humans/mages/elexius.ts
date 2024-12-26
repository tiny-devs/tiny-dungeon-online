import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import ElexiusDialog from '../../dialogs/elexiusDialog.ts'

export default class WizardElexius extends NpcBase {
    constructor() {
        super(Npcs.Wizard2, false, 'elexius', 0, 0, 0, 0, 1000, 0.05, 0, 36, new ElexiusDialog(), [], null)
    }
}