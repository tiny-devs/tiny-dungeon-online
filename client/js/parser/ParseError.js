class ParseError {
  constructor(data) {
      const errorData = this.parseString(data);

      this.message = errorData[1];
  }

  parseString(eventDataString) {
      return eventDataString.split(',');
  }
}