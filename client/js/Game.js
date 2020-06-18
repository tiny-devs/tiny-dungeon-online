class Game {
    constructor(gameConfigs, mainElements) {
        this.width = gameConfigs.width;
        this.height = gameConfigs.height;
        this.boardRows = 16;
        this.boardColumns = 16;
        this.cellWidth = (this.width / this.boardRows) | 0;
        this.cellHeight = (this.height / this.boardColumns) | 0;

        this.backgroundLayer = new BackgroundLayer(this);
        this.solidLayer = new SolidLayer(this);
        this.spritesLayer = new SpritesLayer(this);

        this.currentRoom = new InitialRoom(this);
        this.board = new Board(this, this.backgroundLayer);
    }

    applyServerRules(serverRules) {
        this.boardRows = serverRules.boardRows;
        this.boardColumns = serverRules.boardColumns;
        this.cellWidth = (this.width / this.boardRows) | 0;
        this.cellHeight = (this.height / this.boardColumns) | 0;

        this.board.draw();
        this.currentRoom.draw();
    }
}