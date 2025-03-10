import Cell from './Cell.js';

export default class Resource {
    constructor(game) {
        this.x = Math.random() * (game.canvas.width - Cell.cellSize);
        this.y = Math.floor((Math.random() * 5) + 1) * Cell.cellSize + 40;
        this.width = 20;
        this.height = 30;
        this.amounts = [10, 20, 30, 40, 50, 60];
        this.amountsIndex = Math.floor(Math.random() * this.amounts.length + game.luck);
        this.amount = this.amountsIndex >= this.amounts.length ? this.amounts[this.amounts.length - 1]
            : this.amountsIndex <= 0 ? this.amounts[0]
            : this.amounts[this.amountsIndex];

        this.image = new Image();
        this.image.src = './images/Resource.png';
    }

    render(context) {

        context.drawImage(
            this.image, 
            0, 
            0, 
            this.width - 10, 
            this.height - 10, 
            this.x + 5, 
            this.y + 5, 
            this.width - 10, 
            this.height - 10
        );
    }
}