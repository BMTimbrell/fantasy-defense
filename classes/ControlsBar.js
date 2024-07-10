import Cell from './Cell.js';

export default class ControlsBar {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = Cell.cellSize;
    }

    render(context) {
        context.fillStyle = 'blue';
        context.fillRect(0, 0, this.width, this.height);
    }
}