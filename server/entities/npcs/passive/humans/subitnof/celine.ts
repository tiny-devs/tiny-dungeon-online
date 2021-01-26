import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import CelineDialog from "../../dialogs/celineDialog.ts"

export default class Celine extends NpcBase {
    constructor() {
        super(Npcs.CityFemale3, false, 'celine', 0, 0, 0, 0, 1000, 0.05, 0, 36, new CelineDialog(), [], null)
    }
}