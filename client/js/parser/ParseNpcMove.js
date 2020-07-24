class ParseNpcMove {
  constructor(data) {
      const moveData = this.parseString(data);

      this.id = +moveData[1];
      this.npcId = +moveData[2];
      this.x = +moveData[3];
      this.y = +moveData[4];
      this.roomId = +moveData[5];
  }

  parseString(eventDataString) {
      return eventDataString.split(',');
  }
}