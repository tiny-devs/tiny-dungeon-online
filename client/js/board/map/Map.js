class Map {
    constructor(game) {
        this.game = game;

        this.rooms = this.buildMap();
    }

    getRoomById(roomId) {
        return this.rooms.find(room => {
            return room.id === roomId
        }) || this.rooms[roomId]
    }

    buildMap() {
        return [new InitialRoom(this.game, Rooms.Initial), new Woods(this.game, Rooms.Woods)];
    }
}