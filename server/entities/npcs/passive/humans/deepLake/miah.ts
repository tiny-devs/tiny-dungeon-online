import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import MiahDialog from "../../dialogs/miahDialog.ts"

export default class Miah extends NpcBase {
    constructor() {
        super(Npcs.BlackFemaleFarmer, false, 'miah', 0, 0, 0, 0, 1000, 0.05, 0, 36, new MiahDialog(), [], null)
    }
}