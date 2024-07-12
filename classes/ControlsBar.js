import Cell from './Cell.js';

export default class ControlsBar {
    constructor(canvas, game) {
        this.width = canvas.width;
        this.height = Cell.cellSize;
        this.game = game;
        this.coinImage = new Image();
        this.resourceImage = new Image();
        this.coinImage.src = '../images/Coin.png';
        this.resourceImage.src = '../images/Resource.png';
    }

    render(context) {
        context.save();
        context.fillStyle = 'blue';
        context.fillRect(0, 0, this.width, this.height);

        // resources
        context.drawImage(
            this.resourceImage, 
            0, 
            0, 
            10, 
            20, 
            20, 
            20, 
            10, 
            20
        );
        context.fillStyle = 'gold';
        context.font = '30px Arial';
        context.fillText(this.game.numberOfResources, 50, 40);

        //gold
        context.drawImage(
            this.coinImage, 
            0, 
            0, 
            16, 
            16, 
            20, 
            60, 
            16, 
            16
        );
        context.fillStyle = 'gold';
        context.font = '30px Arial';
        context.fillText(this.game.gold, 50, 80);
        context.restore();
    }
}