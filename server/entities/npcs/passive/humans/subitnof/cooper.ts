import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import CooperDialog from "../../dialogs/cooperDialog.ts"

export default class Cooper extends NpcBase {
    constructor() {
        super(Npcs.CityMale9, false, 'cooper', 0, 0, 0, 0, 1000, 0.05, 0, 36, new CooperDialog(), [], null)
    }
}