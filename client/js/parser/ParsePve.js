class ParsePve {
  constructor(data) {
      const pveData = this.parseString(data);

      this.attacker = pveData[1];
      this.damageCaused = +pveData[2];
      this.npcHp = +pveData[3];
      this.npcId = pveData[4];
      this.playerHp = +pveData[5];
      this.playerId = pveData[6];
      this.roomId = pveData[7];
  }

  parseString(eventDataString) {
      return eventDataString.split(',');
  }
}