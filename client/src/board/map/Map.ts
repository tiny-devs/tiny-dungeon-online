import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Woods } from './Woods'
import { Woods2 } from './Woods2'
import { Woods9 } from './Woods9'
import { Woods10 } from './Woods10'
import { Woods11 } from './Woods11'
import { InitialRoom } from './InitialRoom'

export class Map {
    private game: Game
    public rooms: Array<InitialRoom | Woods>

    constructor(game: Game) {
        this.game = game
        this.rooms = this.buildMap()
    }

    public getRoomById(roomId: Rooms) {
        return this.rooms.find((room) => room.id === roomId) || this.rooms[roomId]
    }

    private buildMap() {
        return [new InitialRoom(this.game, Rooms.Initial), new Woods(this.game, Rooms.Woods), new Woods2(this.game, Rooms.Woods2),
        new Woods9(this.game, Rooms.Woods9), new Woods10(this.game, Rooms.Woods10), new Woods11(this.game, Rooms.Woods11)]
    }
}
