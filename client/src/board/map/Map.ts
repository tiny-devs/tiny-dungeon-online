import { Game } from '../../startup/Game.ts'
import { Rooms } from '../../models/Enums.ts'
import { Woods } from './Woods.ts'
import { InitialRoom } from './InitialRoom.ts'

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
