import Cell from './Cell.js';

export default class ControlsBar {
    constructor(canvas, game) {
        this.width = canvas.width;
        this.height = Cell.cellSize;
        this.game = game;
    }

    render(context) {
        context.fillStyle = 'blue';
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = 'gold';
        context.font = '30px Arial';
        context.fillText(`Resources: ${this.game.numberOfResources}`, 20, 55);
    }
}