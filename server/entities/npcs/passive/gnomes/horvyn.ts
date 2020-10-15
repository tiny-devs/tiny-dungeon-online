import { Npcs } from '../../../../Enums.ts'
import NpcBase from '../../npcBase.ts'
import FlowerForMytklash from "../../quests/gnomes/flowerForMytklash.ts"
import HorvynDialog from "../dialogs/horvynDialog.ts"

export default class Horvyn extends NpcBase {
    constructor() {
        super(Npcs.MaleGnome, false, 'horvyn', 0, 0, 0, 0, 1000, 0.05, 0, 36, new HorvynDialog(), [], new FlowerForMytklash())
    }
}