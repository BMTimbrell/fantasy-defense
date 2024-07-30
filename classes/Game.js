import Cell from './Cell.js';
import ControlsBar from './ControlsBar.js';
import Defender, { Knight, Priest, Wizard, Witch } from './Defender.js';
import Enemy, { Skeleton, Orc, ArmouredOrc, Werewolf, Werebear, OrcRider } from './Enemy.js';
import Resource from './Resource.js';
import FloatingMessage from './FloatingMessage.js';
import UpgradeMenu from './UpgradeMenu.js'

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameGrid = [];
        this.unlocks = {
            knight: false,
            priest: false,
            wizard: false,
            witch: false
        };

        this.controlsBar = new ControlsBar(canvas, this);
        this.mouse = {
            x: 10,
            y: 10,
            width: 0.1,
            height: 0.1,
            clicked: false
        };
        this.canvasPosition = canvas.getBoundingClientRect();
        this.gameOver = false;
        this.gameWon = false;
        this.defenders = [];
        this.numberOfResources = 300;
        this.gold = 0;
        this.luck = 0;
        this.resources = [];
        this.projectiles = [];

        this.floatingMessages = [];

        this.resourceTimer = 5000;

        this.wave = 1;
        this.waveTime = 0;
        this.hoardTrigger = true;
        this.hoardSize = 8;
        this.nextWaveTrigger = true;

        this.upgradeMenu = new UpgradeMenu(this);

        this.enemies = [];
        this.enemiesInterval = 10000;
        this.enemyTimer = this.enemiesInterval;
        this.maxEnemies = 20;
        this.enemiesSpawned = 0;
        this.enemyPositions = [];

        this.skeletonChance = 0;
        this.orcChance = 0;
        this.armouredOrcChance = 0;
        this.werebearChance = 0;
        this.werewolfChance = 0;
        this.orcRiderChance = 0;
        this.lateSkeletonChance = 0;
        this.lateOrcChance = 0;
        this.lateArmouredOrcChance = 0;
        this.lateWerebearChance = 0;
        this.lateWerewolfChance = 0;
        this.lateOrcRiderChance = 0;

        // update mouse position
        this.canvas.addEventListener('mousemove', e => {
            this.mouse.x = (e.x - this.canvasPosition.left) 
                * this.canvas.width / this.canvas.clientWidth;
            this.mouse.y = (e.y - this.canvasPosition.top) 
                * this.canvas.height / this.canvas.clientHeight;


        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });

        window.addEventListener('resize', () => {
            this.canvasPosition = this.canvas.getBoundingClientRect();
        });

        this.canvas.addEventListener('click', () => {
            // choosing defender
            if (
                this.checkCollision(this.mouse, this.controlsBar.archerCard) && 
                !this.gameOver
            ) {
                // cancel selection
                if (this.controlsBar.selectedDefender === this.controlsBar.archerCard.id) {
                    this.controlsBar.selectedDefender = 0;
                    return;
                }
                // select archer
                if (this.numberOfResources >= this.controlsBar.archerCard.defenderCost) this.controlsBar.selectedDefender = this.controlsBar.archerCard.id;
                // not enough to buy
                else {
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 15, '#ff3333', null, 0.03, 0.001));
                    return;
                }
            } else if (
                this.checkCollision(this.mouse, this.controlsBar.knightCard) && 
                !this.gameOver
            ) {
                // cancel selection
                if (this.controlsBar.selectedDefender === this.controlsBar.knightCard.id) {
                    this.controlsBar.selectedDefender = 0;
                    return;
                }
                // select knight
                if (this.numberOfResources >= this.controlsBar.knightCard.defenderCost) this.controlsBar.selectedDefender = this.controlsBar.knightCard.id;
                // not enough to buy
                else {
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 15, '#ff3333', null, 0.03, 0.001));
                    return;
                }
            } else if (
                this.checkCollision(this.mouse, this.controlsBar.priestCard) && 
                !this.gameOver
            ) {
                // cancel selection
                if (this.controlsBar.selectedDefender === this.controlsBar.priestCard.id) {
                    this.controlsBar.selectedDefender = 0;
                    return;
                }
                // select priest
                if (this.numberOfResources >= this.controlsBar.priestCard.defenderCost) this.controlsBar.selectedDefender = this.controlsBar.priestCard.id;
                // not enough to buy
                else {
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 15, '#ff3333', null, 0.03, 0.001));
                    return;
                }
            } else if (
                this.checkCollision(this.mouse, this.controlsBar.wizardCard) && 
                !this.gameOver
            ) {
                // cancel selection
                if (this.controlsBar.selectedDefender === this.controlsBar.wizardCard.id) {
                    this.controlsBar.selectedDefender = 0;
                    return;
                }
                // select wizard
                if (this.numberOfResources >= this.controlsBar.wizardCard.defenderCost) this.controlsBar.selectedDefender = this.controlsBar.wizardCard.id;
                // not enough to buy
                else {
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 15, '#ff3333', null, 0.03, 0.001));
                    return;
                }
            } else if (
                this.checkCollision(this.mouse, this.controlsBar.witchCard) && 
                !this.gameOver
            ) {
                // cancel selection
                if (this.controlsBar.selectedDefender === this.controlsBar.witchCard.id) {
                    this.controlsBar.selectedDefender = 0;
                    return;
                }
                // select witch
                if (this.numberOfResources >= this.controlsBar.witchCard.defenderCost) this.controlsBar.selectedDefender = this.controlsBar.witchCard.id;
                // not enough to buy
                else {
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 15, '#ff3333', null, 0.03, 0.001));
                    return;
                }
            } else if (
                this.checkCollision(this.mouse, this.controlsBar.trashcanCard) && 
                !this.gameOver
            ) {
                // cancel trashcan selection
                if (this.controlsBar.selectedDefender === this.controlsBar.trashcanCard.id) {
                    this.controlsBar.selectedDefender = 0;
                    return;
                }

                // cancel other selections
                this.controlsBar.selectedDefender = 0;

                // select trashcan
                this.controlsBar.selectedDefender = this.controlsBar.trashcanCard.id;
            }

            let defenderCost = !this.controlsBar.defenderCosts[this.controlsBar.selectedDefender] ? 0 : this.controlsBar.defenderCosts[this.controlsBar.selectedDefender];

            // mouse position on grid
            const gridPositionX = this.mouse.x - (this.mouse.x % Cell.cellSize);
            const gridPositionY = this.mouse.y - (this.mouse.y % Cell.cellSize);

            
            if (gridPositionY > Cell.cellSize - 10) {
                // check for witch
                let witchSelected = false;
                if (this.controlsBar.selectedDefender !== 99 ) {
                    this.defenders.forEach(defender => {
                        if (defender instanceof Witch && this.checkCollision(this.mouse, defender)) {
                            this.controlsBar.selectedDefender = 99;
                            this.controlsBar.selectedWitchHealth = defender.health;
                            this.defenders = this.defenders.filter(el => el !== defender);
                            witchSelected = true;
                        }
                    });
                }
                if (witchSelected) return;

                for (let i = 0; i < this.defenders.length; i++) {
                    // can't place defender on top of defender
                    if (this.defenders[i].cellX === gridPositionX && this.defenders[i].cellY === gridPositionY) {
                        if (this.controlsBar.selectedDefender === this.controlsBar.trashcanCard.id) {
                            this.defenders = this.defenders.filter(el => el !== this.defenders[i]);
                            this.controlsBar.selectedDefender = 0;
                        } else if (this.controlsBar.selectedDefender) {
                            this.floatingMessages.push(new FloatingMessage('tile occupied', this.mouse.x + 20, this.mouse.y, 15, '#ff3333', null, 0.03, 0.001));
                        }
                        return;  
                    }
                }
    
                // placing defender
                if (defenderCost) {
                    if (defenderCost === -1) {
                        this.defenders.push(new Witch(gridPositionX, gridPositionY, this, this.controlsBar.selectedWitchHealth));
                        this.controlsBar.selectedDefender = 0;
                        this.controlsBar.selectedWitchHealth = 100;
                    } else {
                        this.defenders.push(
                            this.controlsBar.selectedDefender === this.controlsBar.archerCard.id ? new Defender(gridPositionX, gridPositionY, this) :
                            this.controlsBar.selectedDefender === this.controlsBar.knightCard.id ? new Knight(gridPositionX, gridPositionY, this) : 
                            this.controlsBar.selectedDefender === this.controlsBar.priestCard.id ? new Priest(gridPositionX, gridPositionY, this) :
                            this.controlsBar.selectedDefender === this.controlsBar.wizardCard.id ? new Wizard(gridPositionX, gridPositionY, this) : 
                            this.controlsBar.selectedDefender === this.controlsBar.witchCard.id ? new Witch(gridPositionX, gridPositionY, this) : ''
                        );
                        this.numberOfResources -= defenderCost;
                        this.controlsBar.selectedDefender = 0;
                    }
                }
            }
        });
    }

    createGrid() {
        for (let y = Cell.cellSize; y < this.canvas.height; y += Cell.cellSize) {
            for (let x = 0; x < this.canvas.width; x += Cell.cellSize) {
                this.gameGrid.push(new Cell(x, y, this));
            }
        }
    }

    render(context) {
        if (this.gameOver) {
            context.fillStyle = 'white';
            context.font = '40px Pixel';
            context.fillText('GAME OVER', 280, 330);
        } else if (this.gameWon) {
            context.fillStyle = 'white';
            context.font = '40px Pixel';
            context.fillText('YOU WIN!', 300, 330);
        }

        this.gameGrid.forEach(cell => cell.render(context));
        this.controlsBar.render(context);
        this.defenders.forEach(defender => defender.render(context));
        this.enemies.forEach(enemy => enemy.render(context));
        this.projectiles.forEach(projectile => projectile.render(context));
        this.resources.forEach(resource => resource.render(context));
        this.floatingMessages.forEach(message => message.render(context));

        // show selected defender at cursor
        if (this.controlsBar.selectedDefender === this.controlsBar.archerCard.id) {
            context.drawImage(this.controlsBar.archerImage, 0, 0, 200, 200, this.mouse.x - 100, this.mouse.y - 100, 200, 200);
        } else if (this.controlsBar.selectedDefender === this.controlsBar.knightCard.id) {
            context.drawImage(this.controlsBar.knightImage, 0, 0, 200, 200, this.mouse.x - 100, this.mouse.y - 100, 200, 200);
        } else if (this.controlsBar.selectedDefender === this.controlsBar.priestCard.id) {
            context.drawImage(this.controlsBar.priestImage, 0, 0, 200, 200, this.mouse.x - 100, this.mouse.y - 100, 200, 200);
        } else if (this.controlsBar.selectedDefender === this.controlsBar.wizardCard.id) {
            context.drawImage(this.controlsBar.wizardImage, 0, 0, 200, 200, this.mouse.x - 100, this.mouse.y - 100, 200, 200);
        } else if (this.controlsBar.selectedDefender === this.controlsBar.witchCard.id || this.controlsBar.selectedDefender === 99) {
            context.drawImage(this.controlsBar.witchImage, 0, 5 * 64 + 3, 64, 64, this.mouse.x - 32, this.mouse.y - 32, 64, 64);
        } else if (this.controlsBar.selectedDefender === this.controlsBar.trashcanCard.id) {
            context.drawImage(this.controlsBar.trashcanImage, 0, 0, 64, 64, this.mouse.x - 32, this.mouse.y - 32, 64, 64);
        }

        // upgrade menu
        if (this.upgradeMenu.isShowing) this.upgradeMenu.draw(context);
    }

    update(delta) {
        if (this.gameOver) return;
        this.createGrid();

        // only tick timers while wave is still going
        if (this.enemiesSpawned < this.maxEnemies || this.enemies.length > 0) {
            this.enemyTimer += delta;
            this.resourceTimer += delta;
            this.waveTime += delta;
        }

        // update enemies
        this.enemies.forEach(enemy => {
            enemy.update(delta);
            if (enemy.x < 0) this.gameOver = true;
        });

        // make enemies harder later in wave
        if (this.waveTime > 30000) {
            this.enemiesInterval = 6000;
            this.skeletonChance = this.lateSkeletonChance;
            this.orcChance = this.lateOrcChance;
            this.armouredOrcChance = this.lateArmouredOrcChance;
            this.werebearChance = this.lateWerebearChance;
            this.werewolfChance = this.lateWerewolfChance;
            this.orcRiderChance = this.lateOrcRiderChance;
        }

        // enemy spawn interval
        if (this.maxEnemies - this.enemiesSpawned > this.hoardSize) {
            if (this.enemyTimer >= this.enemiesInterval) {
                this.enemyTimer = 0;
                // vertical position on grid
                const verticalPosition = Math.floor(Math.random() * 5 + 1) * Cell.cellSize;
                // enemy id used for enemy positions
                const enemyID = Date.now().toString(36) + Math.random().toString(36).substring(2);
                this.enemies.push(
                    Math.random() < this.orcRiderChance ? new OrcRider(verticalPosition, this.canvas.width, this, enemyID) :
                    Math.random() < this.werewolfChance ? new Werewolf(verticalPosition, this.canvas.width, this, enemyID) :
                    Math.random() < this.werebearChance ? new Werebear(verticalPosition, this.canvas.width, this, enemyID) :
                    Math.random() < this.armouredOrcChance ? new ArmouredOrc(verticalPosition, this.canvas.width, this, enemyID) :
                    Math.random() < this.skeletonChance ? new Skeleton(verticalPosition, this.canvas.width, this, enemyID) :
                    Math.random() < this.orcChance ? new Orc(verticalPosition, this.canvas.width, this, enemyID) :
                    new Enemy(verticalPosition, this.canvas.width, this, enemyID)
                );
                this.enemyPositions.push({
                    id: enemyID,
                    x: this.canvas.width,
                    y: verticalPosition
                });

                this.enemiesSpawned++;
                
            }
        } else if (this.enemyTimer >= 1000 && this.maxEnemies - this.enemiesSpawned > 0) {
            if (this.hoardTrigger) {
                this.hoardTrigger = false;
                this.floatingMessages.push(new FloatingMessage('Hoard Incoming!', 320, 300, 20, 'white', null, 0.00003, 0));
            }
            this.enemyTimer = 0;
            // vertical position on grid
            const verticalPosition = Math.floor(Math.random() * 5 + 1) * Cell.cellSize;
            // enemy id used for enemy positions
            const enemyID = Date.now().toString(36) + Math.random().toString(36).substring(2);
            this.enemies.push(
                Math.random() < this.orcRiderChance ? new OrcRider(verticalPosition, this.canvas.width, this, enemyID) :
                Math.random() < this.werewolfChance ? new Werewolf(verticalPosition, this.canvas.width, this, enemyID) :
                Math.random() < this.werebearChance ? new Werebear(verticalPosition, this.canvas.width, this, enemyID) :
                Math.random() < this.armouredOrcChance ? new ArmouredOrc(verticalPosition, this.canvas.width, this, enemyID) :
                Math.random() < this.skeletonChance ? new Skeleton(verticalPosition, this.canvas.width, this, enemyID) :
                Math.random() < this.orcChance ? new Orc(verticalPosition, this.canvas.width, this, enemyID) :
                new Enemy(verticalPosition, this.canvas.width, this, enemyID)
            );
            this.enemyPositions.push({
                id: enemyID,
                x: this.canvas.width,
                y: verticalPosition
            });

            this.enemiesSpawned++;
        } else if (this.enemiesSpawned >= this.maxEnemies && this.enemies.length === 0) {
            // wave finished
            this.nextWaveTrigger = false;
            this.resources = [];
            this.defenders = [];
            this.numberOfResources = 0;
            this.controlsBar.selectedDefender = 0;
            this.waveTime = 0;
            this.enemyTimer = this.enemiesInterval;
            this.resourceTimer = 5000;

            if (this.wave === 8) this.gameWon = true;
            else this.upgradeMenu.isShowing = true;

        }

        // spawn resources
        if (this.resourceTimer >= 7000) {
            this.resources.push(new Resource(this));
            this.resourceTimer = 0;
        }

        // collision with resources
        this.resources.forEach(resource => {
            if (this.mouse.x && this.mouse.y && this.checkCollision(resource, this.mouse)) {
                this.numberOfResources += resource.amount;
                this.floatingMessages.push(new FloatingMessage('+' + resource.amount, resource.x, resource.y, 15, 'white'));
                this.resources = this.resources.filter(el => el !== resource);
            }
        });

        // update defenders
        let numberOfPriests = 0;
        this.defenders.forEach(defender => {
            if (defender instanceof Priest) numberOfPriests++;
            defender.update(delta);
        });

        this.luck = numberOfPriests / 1.25;

        // update projectiles
        this.projectiles.forEach(projectile => {
            projectile.update(this, delta);
            if (projectile.x > this.canvas.width) {
                this.projectiles = this.projectiles.filter(el => el !== projectile);
            }
        });

        // floating messages
        this.floatingMessages.forEach(message => message.update(this, delta));

    }

    // collision detection
    checkCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }


}