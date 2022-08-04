import { Npcs } from '../../../shared/Enums.ts'
import NpcBase from './npcBase.ts'
import UpdatesDogDialog from "./passive/dialogs/updatesDogDialog.ts";

export default class Dog extends NpcBase {
    constructor() {
        super(Npcs.Dog, false, 'dog', 0, 0, 0, 0, 1000, 0.25, 0, 36, new UpdatesDogDialog(), [], null)
    }
}