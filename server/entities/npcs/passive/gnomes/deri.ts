import { Npcs } from '../../../../../shared/Enums.ts'
import NpcBase from '../../npcBase.ts'
import DeriDialog from "../dialogs/deriDialog.ts"

export default class Deri extends NpcBase {
    constructor() {
        super(Npcs.FemaleGnome, false, 'deri', 0, 0, 0, 0, 1000, 0.05, 0, 36, new DeriDialog(), [], null)
    }
}