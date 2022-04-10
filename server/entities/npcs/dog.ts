import { Npcs } from '../../Enums.ts'
import Coffee from "../items/consumable/coffee.ts";
import WoodenArmour from "../items/woodenArmour.ts";
import WoodenDagger from "../items/woodenDagger.ts";
import WoodenHelm from "../items/woodenHelm.ts";
import WoodenLegs from "../items/woodenLegs.ts";
import NpcBase from './npcBase.ts'
import UpdatesDogDialog from "./passive/dialogs/updatesDogDialog.ts";

export default class Dog extends NpcBase {
    constructor() {
        super(Npcs.Dog, false, 'dog', 0, 0, 0, 0, 1000, 0.25, 0, 36, new UpdatesDogDialog(), [], null, false,
        [new WoodenDagger(1), new WoodenLegs(1), new WoodenArmour(1), new WoodenHelm(1), new Coffee(1)])
    }
}