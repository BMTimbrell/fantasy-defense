import Cell from './Cell.js';

export default class ControlsBar {
    constructor(canvas, game) {
        this.width = canvas.width;
        this.height = Cell.cellSize;
        this.game = game;
        this.coinImage = new Image();
        this.resourceImage = new Image();
        this.archerImage = new Image();
        this.knightImage = new Image();
        this.priestImage = new Image();
        this.coinImage.src = '../images/Coin.png';
        this.resourceImage.src = '../images/Resource.png';
        this.archerImage.src = '../images/Archer(no-shadows).png';
        this.knightImage.src = '../images/Knight(no-shadows).png';
        this.priestImage.src = '../images/Priest(no-shadows).png';
        this.archerCard = {
            id: 1,
            x: 150,
            y: 15,
            width: 60,
            height: 70,
            defenderCost: 100
        };
        this.knightCard = {
            id: 2,
            x: 220,
            y: 15,
            width: 60,
            height: 70,
            defenderCost: 50
        };
        this.priestCard = {
            id: 3,
            x: 290,
            y: 15,
            width: 60,
            height: 70,
            defenderCost: 100
        };
        this.selectedDefender = 0;
        this.defenderCosts = {
            0: 0,
            [this['archerCard']['id']]: this.archerCard['defenderCost'],
            [this['knightCard']['id']]: this.knightCard['defenderCost'],
            [this['priestCard']['id']]: this.priestCard['defenderCost']
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

        // knight card
        context.save();
        context.globalAlpha = this.game.numberOfResources >= this.knightCard.defenderCost ? 1 : 0.6;
        context.fillStyle = 'black';
        context.fillRect(this.knightCard.x, this.knightCard.y, this.knightCard.width, this.knightCard.height);
        context.drawImage(this.knightImage, 0, 0, 200, 200, this.knightCard.x - 75, this.knightCard.y - 75, 200, 200);
        context.fillStyle = 'gold';
        context.font = '20px Arial';
        context.fillText(this.knightCard.defenderCost, this.knightCard.x + 15, this.knightCard.y + 65);
        context.drawImage(this.resourceImage, 0, 0, 200, 200, this.knightCard.x + 2, this.knightCard.y + 48, 200, 200);
        context.restore();

        // priest card
        context.save();
        context.globalAlpha = this.game.numberOfResources >= this.priestCard.defenderCost ? 1 : 0.6;
        context.fillStyle = 'black';
        context.fillRect(this.priestCard.x, this.priestCard.y, this.priestCard.width, this.priestCard.height);
        context.drawImage(this.priestImage, 0, 0, 200, 200, this.priestCard.x - 75, this.priestCard.y - 75, 200, 200);
        context.fillStyle = 'gold';
        context.font = '20px Arial';
        context.fillText(this.priestCard.defenderCost, this.priestCard.x + 15, this.priestCard.y + 65);
        context.drawImage(this.resourceImage, 0, 0, 200, 200, this.priestCard.x + 2, this.priestCard.y + 48, 200, 200);
        context.restore();
    }
}