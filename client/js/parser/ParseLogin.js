class ParseLogin {
    constructor(data) {
        const loginData = this.parseString(data)

        this.playerId = loginData[1];
        this.serverRules = {
            boardRows: +loginData[2],
            boardColumns: +loginData[3]
        }
        this.players = JSON.parse(loginData[4]);
    }

    parseString(eventDataString) {
        let rawDataString = eventDataString;
        let matrix = '';
        rawDataString = eventDataString.substr(0, eventDataString.indexOf(',['));
        matrix = eventDataString.substr(eventDataString.indexOf('['), eventDataString.length);

        let eventData = rawDataString.split(',');
        eventData.push(matrix);

        return eventData;
    }
}