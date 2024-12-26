import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import SomebodyOnceToldMe from '../../../quests/humans/subitnof/somebodyOnceToldMe.ts'
import KingZanderDialog from "../../dialogs/kingZanderDialog.ts"

export default class KingZander extends NpcBase {
    constructor() {
        super(Npcs.KingSubitnof, false, 'zander', 0, 0, 0, 0, 1000, 0.05, 0, 36, new KingZanderDialog(), [], new SomebodyOnceToldMe())
    }
}