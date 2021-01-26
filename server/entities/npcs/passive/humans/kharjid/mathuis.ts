import { Npcs } from '../../../../../Enums.ts'
import NpcBase from '../../../npcBase.ts'
import ZombieKiller from "../../../quests/humans/kharjid/zombieKiller.ts"
import MathuisDialog from "../../dialogs/mathuisDialog.ts"

export default class Mathuis extends NpcBase {
    constructor() {
        super(Npcs.DesertMale4, false, 'mathuis', 0, 0, 0, 0, 1000, 0.05, 0, 36, new MathuisDialog(), [], new ZombieKiller())
    }
}