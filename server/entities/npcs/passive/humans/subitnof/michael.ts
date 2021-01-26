import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import MichaelDialog from "../../dialogs/michaelDialog.ts"

export default class Michael extends NpcBase {
    constructor() {
        super(Npcs.CityMale6, false, 'michael', 0, 0, 0, 0, 1000, 0.05, 0, 36, new MichaelDialog(), [], null)
    }
}