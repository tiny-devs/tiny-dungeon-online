import { Game } from '../../startup/Game'
import { Rooms } from '../../../../shared/Enums'
import { MapBuilder } from './MapBuilder'

export class Map {
    public rooms: Array<any>
    public mapBuilder: MapBuilder

    constructor(game: Game) {
        this.mapBuilder = new MapBuilder(game)
        this.rooms = this.mapBuilder.buildMap()
    }

    public getRoomById(roomId: Rooms) {
        return this.rooms.find((room) => room.id === roomId) || this.rooms[roomId]
    }
}
