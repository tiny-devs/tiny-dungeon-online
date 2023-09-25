import { Game } from '../../startup/Game'
import { Direction, Rooms } from '../../../../shared/Enums'
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

    public getDirectionMovedByRoomIds(fromRoomId: Rooms, toRoomId: Rooms) {
        if (fromRoomId + 1 == toRoomId)
            return Direction.Right
        if (fromRoomId - 1 == toRoomId)
            return Direction.Left
        if (fromRoomId < toRoomId)
            return Direction.Up
        return Direction.Down
    }
}
