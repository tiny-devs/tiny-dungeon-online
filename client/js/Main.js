class Main {
    constructor(configs) {
      this.loginScreen = document.getElementById('login');
      this.resetCanvasBtn = document.getElementById('help-draw-mobile');
      this.mobileControls = document.getElementById('mobile-controls');
      this.playerNameInput = document.getElementById('player-name');
      this.confirmBtn = document.getElementById('confirm-btn');
      this.mobileUp = document.getElementById('up');
      this.mobileDown = document.getElementById('down');
      this.mobileLeft = document.getElementById('left');
      this.mobileRight = document.getElementById('right');
      this.gameScreen = document.getElementById('game');
      this.gameScreen.style.display='none';
      this.layersParentElement = document.getElementById('layers');

      this.mobile = this.isMobile();
      if (this.mobile) {
        this.setupMobile();
        configs.game.width = 256;
        configs.game.height = 256;
      }

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
      this.hasConfirmedName = false;
  
      this.confirmBtn.onclick = () => { this.onConfirmName() };
      this.resetCanvasBtn.onclick = () => { this.drawingGrid.reset() };
    }

    isMobile() {
      const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i
      ];
  
      return toMatch.some((toMatchItem) => {
          return navigator.userAgent.match(toMatchItem);
      });
    }

    setupMobile() {
      document.body.addEventListener('touchmove', (e) => { 
        e.preventDefault();
      }, { passive: false });
      const helpDesktop = document.getElementById('help-draw-desktop');
      helpDesktop.style.display = 'none';
      this.resetCanvasBtn.style.display = 'block';
      this.layersParentElement.style.width = `${window.screen.width}px`;
    }
  
    onConfirmName() {
      if (!this.hasConfirmedName) {
        if (this.playerNameInput.value) {
          this.clientConfigs.playerName = this.playerNameInput.value;
          if (this.hasDraw()) {
            this.hasConfirmedName = true;
            this.clientConfigs.playerMatrix = this.drawingGrid.drawingMatrix.map((arr) => {
              return arr.slice();
            });
             
            if (this.mobile) {
              const title = document.getElementById('title-content');
              title.style.display = 'none';
            }
            this.startGame();
          }
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
  