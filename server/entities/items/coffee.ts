import { Items, Rooms } from "../../Enums.ts"
import ItemBase from "./itemBase.ts"

export default class Coffee extends ItemBase {

    constructor(roomId: Rooms) {
        super(Items.Coffee, true, false, false, 0, 0, 0, 5, roomId)
    }
}