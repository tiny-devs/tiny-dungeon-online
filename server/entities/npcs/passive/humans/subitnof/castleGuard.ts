import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import CastleGuardDialog from '../../dialogs/castleGuardDialog.ts'

export default class CastleGuard extends NpcBase {
    constructor() {
        super(Npcs.CityGuard, false, 'subitnofguard', 0, 0, 0, 0, 1000, 0.05, 0, 36, new CastleGuardDialog(), [], null)
    }
}