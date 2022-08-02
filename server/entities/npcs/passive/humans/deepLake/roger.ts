import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import RogerDialog from "../../dialogs/rogerDialog.ts"

export default class Roger extends NpcBase {
    constructor() {
        super(Npcs.WhiteMaleFarmer, false, 'roger', 0, 0, 0, 0, 1000, 0.05, 0, 36, new RogerDialog(), [], null)
    }
}