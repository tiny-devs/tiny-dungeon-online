import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import BorisDialog from "../../dialogs/borisDialog.ts"

export default class Boris extends NpcBase {
    constructor() {
        super(Npcs.CityMale5, false, 'boris', 0, 0, 0, 0, 1000, 0.05, 0, 36, new BorisDialog(), [], null)
    }
}