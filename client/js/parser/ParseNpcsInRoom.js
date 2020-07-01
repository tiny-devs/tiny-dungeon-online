class ParseNpcsInRoom {
  constructor(data) {
      const npcsInRoom = this.parseString(data)

      this.npcs = JSON.parse(npcsInRoom[1]);
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