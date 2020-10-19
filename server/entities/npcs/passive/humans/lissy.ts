import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import LissyDialog from "../dialogs/lissyDialog.ts"

export default class Lissy extends NpcBase {
    constructor() {
        super(Npcs.WhiteFemaleFarmer, false, 'lissy', 0, 0, 0, 0, 1000, 0.05, 0, 36, new LissyDialog(), [], null)
    }
}