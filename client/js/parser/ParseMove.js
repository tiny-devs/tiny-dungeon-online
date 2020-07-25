class ParseMove {
    constructor(data) {
        const moveData = this.parseString(data);

        this.playerId = moveData[1];
        this.currentRoomId = +moveData[4];
        this.x = +moveData[2];
        this.y = +moveData[3];
    }

    parseString(eventDataString) {
        return eventDataString.split(',');
    }
}