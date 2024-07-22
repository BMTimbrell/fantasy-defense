import Cell from './Cell.js';

export default class ControlsBar {
    constructor(canvas, game) {
        this.width = canvas.width;
        this.height = Cell.cellSize;
        this.game = game;
        this.coinImage = new Image();
        this.resourceImage = new Image();
        this.archerImage = new Image();
        this.coinImage.src = '../images/Coin.png';
        this.resourceImage.src = '../images/Resource.png';
        this.archerImage.src = '../images/Archer(no-shadows).png';
        this.archerCard = {
            id: 1,
            x: 130,
            y: 15,
            width: 50,
            height: 70,
            defenderCost: 100
        };
        this.knightCard = {
            id: 2,
        };
        this.selectedDefender = 0;
        this.defenderCosts = {
            0: 0,
            [this['archerCard']['id']]: this.archerCard['defenderCost']
        };
    }

    render(context) {
        context.fillStyle = 'gray';
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

        // archer card
        context.save();
        context.globalAlpha = this.game.numberOfResources >= this.archerCard.defenderCost ? 1 : 0.6;
        context.fillStyle = 'black';
        context.fillRect(this.archerCard.x, this.archerCard.y, this.archerCard.width, this.archerCard.height);
        context.drawImage(this.archerImage, 0, 0, 200, 200, this.archerCard.x - 75, this.archerCard.y - 75, 200, 200);
        context.fillStyle = 'gold';
        context.font = '20px Arial';
        context.fillText(this.archerCard.defenderCost, this.archerCard.x + 15, this.archerCard.y + 65);
        context.drawImage(this.resourceImage, 0, 0, 200, 200, this.archerCard.x + 2, this.archerCard.y + 48, 200, 200);
        context.restore();
    }
}