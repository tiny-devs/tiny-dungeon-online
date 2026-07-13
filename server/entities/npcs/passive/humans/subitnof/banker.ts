import { Npcs } from '../../../../../../shared/Enums.ts'
import NpcBase from '../../../npcBase.ts'
import BankerDialog from "../../dialogs/bankerDialog.ts"

export default class Banker extends NpcBase {
    constructor() {
        super(
            Npcs.Banker,
            false,
            'banker',
            0, 0, 0, 0,
            1000, 0, 0, 36,
            new BankerDialog(),
            [], null, false, [],
            true
        )
    }
}
