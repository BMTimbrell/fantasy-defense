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

        //resources
        context.fillStyle = 'gold';
        context.font = '30px Arial';
        context.fillText(`Resources: ${this.game.resources}`, 20, 40);

        //gold
        context.fillStyle = 'gold';
        context.font = '30px Arial';
        context.fillText(`Gold: ${this.game.gold}`, 20, 80);
    }
}