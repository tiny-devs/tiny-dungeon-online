import { Game } from '../../startup/Game'
import { Rooms } from '../../models/Enums'
import { Woods } from './Woods'
import { Woods2 } from './Woods2'
import { Woods3 } from './Woods3'
import { Woods4 } from './Woods4'
import { Woods5 } from './Woods5'
import { Woods6 } from './Woods6'
import { Woods7 } from './Woods7'
import { Woods8 } from './Woods8'
import { River14 } from './River14'
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
        return [new InitialRoom(this.game, Rooms.Initial), new Woods(this.game, Rooms.Woods), new Woods2(this.game, Rooms.Woods2),new Woods3(this.game, Rooms.Woods3),new Woods4(this.game, Rooms.Woods4),new Woods5(this.game, Rooms.Woods5),new Woods6(this.game, Rooms.Woods6),new Woods7(this.game, Rooms.Woods7),new Woods8(this.game, Rooms.Woods8),new River14(this.game, Rooms.River14),
        new Woods9(this.game, Rooms.Woods9), new Woods10(this.game, Rooms.Woods10), new Woods11(this.game, Rooms.Woods11)]
    }
}
