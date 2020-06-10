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

class DrawingCanvas {
  constructor(main, configs) {
      this.main = main;
      this.c = document.getElementById('draw');
      this.c.onmousemove = this.mouseMove.bind(this);
      this.c.onmousedown = this.mouseClick.bind(this);
      this.c.onmouseup = this.mouseClick.bind(this);
      this.c.oncontextmenu = (e) => {return false;};
      this.ctx = this.c.getContext('2d');

      this.width = configs.drawingGridWidth;
      this.height = configs.drawingGridHeight;
      this.drawingGridRows = configs.drawingGridRows;
      this.drawingGridColumns = configs.drawingGridColumns;
      this.ctx.canvas.width  = this.width;
      this.ctx.canvas.height = this.height;
      this.cellWidth = this.width/this.drawingGridRows;
      this.cellHeight = this.height/this.drawingGridColumns;
      this.drawing = false;
      this.erasing = false;
      
      this.drawingMatrix = [];
      this.initDrawingMatrix();
      this.grid = new DrawingGrid(this);
  }

  initDrawingMatrix() {
      for(let i=0; i < this.drawingGridRows; i++) {
          this.drawingMatrix.push([]);
          for(let j=0; j < this.drawingGridColumns; j++) {
              this.drawingMatrix[i][j] = 0;
          }
      }
  }

  mouseMove(e) {
      e = e || window.event;
      
      if (this.drawing || this.erasing) {
         this.draw(e.layerX, e.layerY);
      }
  }

  mouseClick(e) {
      e = e || window.event;

      if (e.type === 'mousedown') {
          if (e.button == 0) {
              this.drawing = true;
              this.erasing = false;
          } else if (e.button == 2) {
              this.erasing = true;
              this.drawing = false;
          }
          
          this.draw(e.layerX, e.layerY);
      } else {
          this.drawing = false;
          this.erasing = false;
      }
  }

  draw(x,y) {
      x = Math.floor(x/this.cellWidth);
      y = Math.floor(y/this.cellHeight);
      let color = 'black';
      let matrixValue = 1;
      
      if (this.erasing) {
          color = 'white';
          matrixValue = 0;
      }
      
      this.ctx.beginPath();
      this.ctx.rect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.stroke();
      
      this.drawingMatrix[y][x] = matrixValue;
  }
}

class DrawingGrid {
  constructor(drawingCanvas) {
      this.drawingCanvas = drawingCanvas;

      this.draw();
  }

  draw() {
      let i = 0;
      let j = 0;
      for(i = 0; i < this.drawingCanvas.drawingGridRows; i++) {
          for(j = 0; j < this.drawingCanvas.drawingGridColumns; j++) {
              this.drawingCanvas.ctx.beginPath();
              this.drawingCanvas.ctx.rect(i * this.drawingCanvas.cellWidth,
                  j * this.drawingCanvas.cellHeight,
                  this.drawingCanvas.cellWidth,
                  this.drawingCanvas.cellHeight);
              this.drawingCanvas.ctx.stroke();
          }
      }
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
