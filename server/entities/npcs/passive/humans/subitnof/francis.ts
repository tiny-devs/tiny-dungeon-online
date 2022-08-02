import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import FrancisDialog from "../../dialogs/francisDialog.ts"

export default class Francis extends NpcBase {
    constructor() {
        super(Npcs.CityOldMale1, false, 'francis', 0, 0, 0, 0, 1000, 0.05, 0, 36, new FrancisDialog(), [], null)
    }
}