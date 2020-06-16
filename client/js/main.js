class Main {
  constructor(configs) {
    this.loginScreen = document.getElementById('login');
    this.playerNameInput = document.getElementById('player-name');
    this.confirmBtn = document.getElementById('confirm-btn');
    this.gameScreen = document.getElementById('game');
    this.gameScreen.style.display='none';
    this.layersParentElement = document.getElementById('layers');
    this.layersParentElement.style.width = `${configs.game.width}px`;
    this.layersParentElement.style.height = `${configs.game.height}px`;
    
    this.drawingGrid = new DrawingCanvas(this, configs.drawingGrid);

    this.clientConfigs = {
      playerName: '',
      playerMatrix: []
    }
    this.gameConfigs = configs.game;

    this.game = null;
    this.client = null;

    this.confirmBtn.onclick = () => { this.onConfirmName() };
  }

  onConfirmName() {
    if (this.playerNameInput.value) {
      this.clientConfigs.playerName = this.playerNameInput.value;
      if (this.hasDraw()) {
        this.clientConfigs.playerMatrix = this.drawingGrid.drawingMatrix.map((arr) => {
          return arr.slice();
        });
         
        this.startGame();
      }
    }
  }

  hasDraw() {
    let hasAnyDraw = false;
    for(let i=0; i < this.drawingGrid.drawingGridRows; i++) {
      for(let j=0; j < this.drawingGrid.drawingGridColumns; j++) {
        if (this.drawingGrid.drawingMatrix[i][j] == 1) {
          hasAnyDraw = true;
        }
      }
    }
    return hasAnyDraw;
  }

  startGame() {
    this.game = new Game(this.gameConfigs, this);
    this.client = new Client(this.game, this.clientConfigs, this);
  }
}

let gameConfigs = {
  game: {
    width: 512,
    height: 512,
  },
  drawingGrid: {
    drawingGridWidth: 160,
    drawingGridHeight: 160,
    drawingGridRows: 8,
    drawingGridColumns: 8,
  },
};

window.onload = () => {
  const game = new Main(gameConfigs);
};
