import Cell from './Cell.js';

export default class Resource {
    constructor(game) {
        this.x = Math.random() * (game.canvas.width - Cell.cellSize);
        this.y = Math.floor((Math.random() * 5) + 1) * Cell.cellSize + 25;
        this.width = Cell.cellSize * 0.6;
        this.height = Cell.cellSize * 0.6;
        this.amounts = [10, 20, 30, 40, 50, 60];
        this.amountsIndex = Math.floor(Math.random() * this.amounts.length + game.luck);
        this.amount = this.amountsIndex >= this.amounts.length ? this.amounts[this.amounts.length - 1]
            :  this.amountsIndex <= 0 ? this.amounts[0]
            : this.amounts[this.amountsIndex];
    }

    render(context) {
        context.save();
        context.fillStyle = 'yellow';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText(this.amount, this.x + 15, this.y + 25);
        context.restore();
    }
}