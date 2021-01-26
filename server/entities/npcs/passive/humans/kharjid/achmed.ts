import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import AchmedDialog from "../../dialogs/achmedDialog.ts"

export default class Achmed extends NpcBase {
    constructor() {
        super(Npcs.DesertMale2, false, 'achmed', 0, 0, 0, 0, 1000, 0.05, 0, 36, new AchmedDialog(), [], null)
    }
}