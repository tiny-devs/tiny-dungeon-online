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