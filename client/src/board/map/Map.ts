import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Woods } from './Woods'
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
        return [new InitialRoom(this.game, Rooms.Initial), new Woods(this.game, Rooms.Woods)]
    }
}
