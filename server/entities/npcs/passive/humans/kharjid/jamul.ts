import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import JamulDialog from "../../dialogs/jamulDialog.ts"

export default class Jamul extends NpcBase {
    constructor() {
        super(Npcs.DesertMale1, false, 'jamul', 0, 0, 0, 0, 1000, 0.05, 0, 36, new JamulDialog(), [], null)
    }
}