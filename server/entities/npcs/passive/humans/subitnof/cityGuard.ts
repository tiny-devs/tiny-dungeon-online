import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import CityGuardDialog from "../../dialogs/cityGuardDialog.ts"

export default class CityGuard extends NpcBase {
    constructor() {
        super(Npcs.CityGuard, false, 'subitnofguard', 0, 0, 0, 0, 1000, 0.05, 0, 36, new CityGuardDialog(), [], null)
    }
}