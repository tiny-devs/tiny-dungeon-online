import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import MarcusDialog from "../../dialogs/marcusDialog.ts"

export default class Marcus extends NpcBase {
    constructor() {
        super(Npcs.CityOldMale2, false, 'marcus', 0, 0, 0, 0, 1000, 0.05, 0, 36, new MarcusDialog(), [], null)
    }
}