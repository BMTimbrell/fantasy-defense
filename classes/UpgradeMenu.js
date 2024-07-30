import Button from './Button.js';
import splitLines from '../helper/splitLines.js';
import ControlsBar from './ControlsBar.js';

export default class UpgradeMenu {
    constructor(game) {
        this.game = game;
        this.width = 500;
        this.height = 450;
        this.x = (game.canvas.width - this.width) / 2;
        this.y = (game.canvas.height - this.height) / 2 + 55;
        this.gap = 15;
        this.isShowing = false;
        this.restart();
        this.game.canvas.addEventListener('click', this.handleButtonClick.bind(this));
    }

    
    draw(context) {
        context.save();
        context.fillStyle = '#8c8c8c';
        context.fillRect(this.x, this.y, this.width, this.height);
        // title
        context.fillStyle = 'white';
        context.font = '20px Pixel';
        let metrics = context.measureText('Purchase Defenders');
        const titleWidth = metrics.width;
        const titleHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        context.fillText('Purchase Defenders', this.x + (this.width - titleWidth) / 2, this.y + titleHeight + this.gap);

        // knight upgrade
        context.font = '12px Pixel';
        metrics = context.measureText('Purchase Defenders');
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        if (!this.game.unlocks.knight) {
            splitLines(
                context, 
                `Knight: A melee range fighter with \nhigh health.\nCost: ${this.buttons[1].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 5 + textHeight, 
                20
            );
        }

        // priest upgrade
        if (!this.game.unlocks.priest) {
            splitLines(
                context, 
                `Priest: Heals allies and boosts \nluck, increasing chances of higher \nvalue resources.\nCost: ${this.buttons[2].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 10 + textHeight, 
                20
            );
        }

        // wizard upgrade
        if (!this.game.unlocks.wizard) {
            splitLines(
                context, 
                `Wizard: Deals twice the damage as \narchers.\nCost: ${this.buttons[3].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 16 + textHeight, 
                20
            );
        }

        // witch upgrade
        if (!this.game.unlocks.witch) {
            splitLines(
                context, 
                `Witch: Deals more damage than \nwizards and can be repositioned\nCost: ${this.buttons[4].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 21 + textHeight, 
                20
            );
        }

        // draw buttons
        this.buttons.forEach(button => {
            if (button.name === 'nextWaveButton') {
                button.button.draw(context);
            } else if (!this.game.unlocks[button.name]) {
                if (button.isEnabled) {
                    if (this.game.gold >= button.upgradeCost) {
                        button.button.draw(context);
                    } else {
                        button.button.draw(context, true);
                    }
                }
            }
        });
        
        context.restore();
    }

    handleButtonClick() {
        // if menu is showing let player click buttons
        if (this.isShowing) {
            let buttonName = '';
            this.buttons.forEach(button => {
                // next wave button
                if (button.name === 'nextWaveButton') {
                    if (this.game.checkCollision(this.game.mouse, button.button)) {
                        
                        // hide menu and start next wave
                        this.isShowing = false;
                        this.game.nextWaveTrigger = true;
                        this.game.enemiesSpawned = 0;
                        this.game.enemiesInterval = 8000;
                        this.game.enemyTimer = this.game.enemiesInterval;
                        this.game.orcChance = 0;
                        this.game.skeletonChance = 0;
                        this.game.armouredOrcChance = 0;
                        this.game.numberOfResources = 300;
                        this.game.maxEnemies += 5;
                        this.game.hoardSize += 2;
                        this.game.hoardTrigger = true;
                        this.game.wave++;
                        switch (this.game.wave) {
                            case 2:
                                this.game.lateOrcChance = 0.2;
                                break;
                            case 3:
                                this.game.lateOrcChance = 0.4;
                                this.game.lateSkeletonChance = 0.2;
                                break;
                            case 4:
                                this.game.lateOrcChance = 0.5;
                                this.game.lateSkeletonChance = 0.4;
                                this.game.lateArmouredOrcChance = 0.2;
                                break;
                        }
                    }
                // purchase upgrade buttons
                } else if (this.game.checkCollision(this.game.mouse, button.button)) {
                    if (
                        button.isEnabled &&
                        button.upgradeCost <= this.game.gold
                    ) {
                        buttonName = button.name;
                        button.isEnabled = false;
                        this.game.gold -= button.upgradeCost;
                        this.game.unlocks[button.name] = true;
                        this.game.controlsBar = new ControlsBar(this.game.canvas, this.game);
                    }
                }
            });
        }
    }

    restart() {
        this.buttons = [
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 150 - this.gap, 
                    this.y + this.height - 50 - this.gap, 
                    'NEXT WAVE',
                    150, 
                    50
                ),
                name: 'nextWaveButton'
                    
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 5, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'knight',
                upgradeCost: 500,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 10, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'priest',
                upgradeCost: 1000,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 15, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'wizard',
                upgradeCost: 2000,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 20, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'witch',
                upgradeCost: 5000,
                isEnabled: true
            }
        ]
    }
}