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
        this.wizardImage = new Image();
        this.witchImage = new Image();
        this.trashcanImage = new Image();
        this.coinImage.src = '../images/Coin.png';
        this.resourceImage.src = '../images/Resource.png';
        this.archerImage.src = '../images/Archer(no-shadows).png';
        this.knightImage.src = '../images/Knight(no-shadows).png';
        this.priestImage.src = '../images/Priest(no-shadows).png';
        this.wizardImage.src = '../images/Wizard(no-shadows).png';
        this.witchImage.src = '../images/Witch.png';
        this.trashcanImage.src = '../images/trashcan.png';

        this.archerCard = {
            id: 1,
            x: 150,
            y: 15,
            width: 60,
            height: 70,
            defenderCost: 100
        };

        this.numberOfUnlocks = 0;

        for (const unlock in this.game.unlocks) {
            if (this.game.unlocks[unlock]) this.numberOfUnlocks++;
            
            this.knightCard = {
                id: 2,
                x: !this.game.unlocks.knight ? -10000 : 220,
                y: 15,
                width: 60,
                height: 70,
                defenderCost: 50
            };
            
            if (unlock === 'priest') {
                this.priestCard = {
                    id: 3,
                    x: !this.game.unlocks.priest ? -10000 : this.numberOfUnlocks > 1 ? 290 : 220,
                    y: 15,
                    width: 60,
                    height: 70,
                    defenderCost: 100
                };
            }
            
            if (unlock === 'wizard') {
                this.wizardCard = {
                    id: 4,
                    x: !this.game.unlocks.wizard ? -10000 : this.numberOfUnlocks > 2 ? 360 : this.archerCard.x + this.numberOfUnlocks * 70,
                    y: 15,
                    width: 60,
                    height: 70,
                    defenderCost: 200
                };
            }
    
            this.witchCard = {
                id: 5,
                x: !this.game.unlocks.witch ? -10000 : this.numberOfUnlocks > 3 ? 430 : this.archerCard.x + this.numberOfUnlocks * 70,
                y: 15,
                width: 60,
                height: 70,
                defenderCost: 350
            };
        }

        this.trashcanCard = {
            id: 6,
            x: this.archerCard.x + this.numberOfUnlocks * 70 + 70,
            y: 15,
            width: 60,
            height: 70
        };

        this.selectedDefender = 0;
        this.defenderCosts = {
            0: 0,
            [this['archerCard']['id']]: this.archerCard['defenderCost'],
            [this['knightCard']['id']]: this.knightCard['defenderCost'],
            [this['priestCard']['id']]: this.priestCard['defenderCost'],
            [this['wizardCard']['id']]: this.wizardCard['defenderCost'],
            [this['witchCard']['id']]: this.witchCard['defenderCost'],
            99: -1
        };

        this.selectedWitchHealth = 100;
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
        context.font = '15px Pixel';
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
        context.font = '15px Pixel';
        context.fillText(this.game.gold, 50, 77);

        // archer card
        context.save();
        context.globalAlpha = this.game.numberOfResources >= this.archerCard.defenderCost ? 1 : 0.6;
        context.fillStyle = 'black';
        context.fillRect(this.archerCard.x, this.archerCard.y, this.archerCard.width, this.archerCard.height);
        context.drawImage(this.archerImage, 0, 0, 200, 200, this.archerCard.x - 75, this.archerCard.y - 75, 200, 200);
        context.fillStyle = 'gold';
        context.font = '12px Pixel';
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
        context.font = '12px Pixel';
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
        context.font = '12px Pixel';
        context.fillText(this.priestCard.defenderCost, this.priestCard.x + 15, this.priestCard.y + 65);
        context.drawImage(this.resourceImage, 0, 0, 200, 200, this.priestCard.x + 2, this.priestCard.y + 48, 200, 200);
        context.restore();

        // wizard card
        context.save();
        context.globalAlpha = this.game.numberOfResources >= this.wizardCard.defenderCost ? 1 : 0.6;
        context.fillStyle = 'black';
        context.fillRect(this.wizardCard.x, this.wizardCard.y, this.wizardCard.width, this.wizardCard.height);
        context.drawImage(this.wizardImage, 0, 0, 200, 200, this.wizardCard.x - 75, this.wizardCard.y - 75, 200, 200);
        context.fillStyle = 'gold';
        context.font = '12px Pixel';
        context.fillText(this.wizardCard.defenderCost, this.wizardCard.x + 15, this.wizardCard.y + 65);
        context.drawImage(this.resourceImage, 0, 0, 200, 200, this.wizardCard.x + 2, this.wizardCard.y + 48, 200, 200);
        context.restore();

        // witch card
        context.save();
        context.globalAlpha = this.game.numberOfResources >= this.witchCard.defenderCost ? 1 : 0.6;
        context.fillStyle = 'black';
        context.fillRect(this.witchCard.x, this.witchCard.y, this.witchCard.width, this.witchCard.height);
        context.drawImage(this.witchImage, 0, 5 * 64, 64, 64, this.witchCard.x, this.witchCard.y - 3, 54, 54);
        context.fillStyle = 'gold';
        context.font = '12px Pixel';
        context.fillText(this.witchCard.defenderCost, this.witchCard.x + 15, this.witchCard.y + 65);
        context.drawImage(this.resourceImage, 0, 0, 200, 200, this.witchCard.x + 2, this.witchCard.y + 48, 200, 200);
        context.restore();

        // delete card
        context.save();
        context.fillStyle = 'black';
        context.fillRect(this.trashcanCard.x, this.trashcanCard.y, this.trashcanCard.width, this.trashcanCard.height);
        context.drawImage(this.trashcanImage, 0, 0, 64, 64, this.trashcanCard.x - 2, this.trashcanCard.y + 3, 64, 64);
        context.restore();
    }
}