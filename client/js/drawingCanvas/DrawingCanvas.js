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
  
        let pos = this.getOffset(e);
        
        if (this.drawing || this.erasing) {
           this.draw(pos.x, pos.y);
        }
    }
  
    mouseClick(e) {
        e = e || window.event;
  
        let pos = this.getOffset(e);
  
        if (e.type === 'mousedown') {
            if (e.button == 0) {
                this.drawing = true;
                this.erasing = false;
            } else if (e.button == 2) {
                this.erasing = true;
                this.drawing = false;
            }
            
            this.draw(pos.x, pos.y);
        } else {
            this.drawing = false;
            this.erasing = false;
        }
    }
  
    getOffset(e) {
      let target = e.target || e.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = (e.clientX - rect.left),
      offsetY = (e.clientY - rect.top);
  
      return { x: (offsetX | 0), y: (offsetY | 0) };
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