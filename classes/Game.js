import Cell from './Cell.js';
import ControlsBar from './ControlsBar.js';
import Defender, { Knight } from './Defender.js';
import Enemy from './Enemy.js';
import Resource from './Resource.js';
import FloatingMessage from './FloatingMessage.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameGrid = [];
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
        this.defenders = [];
        this.numberOfResources = 300;
        this.gold = 0;
        this.luck = 0;
        this.resources = [];
        this.projectiles = [];

        this.floatingMessages = [];

        this.resourceTimer = 5000;

        this.enemies = [];
        this.enemiesInterval = 8000;
        this.enemyTimer = this.enemiesInterval;
        this.maxEnemies = 10;
        this.enemyPositions = [];

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

        this.canvas.addEventListener('mousedown', () => {
            this.mouse.clicked = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.clicked = false;
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
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 20, 'red'));
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
                    this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 20, 'red'));
                    return;
                }
            }

            let defenderCost = !this.controlsBar.defenderCosts[this.controlsBar.selectedDefender] ? 0 : this.controlsBar.defenderCosts[this.controlsBar.selectedDefender];

            // mouse position on grid
            const gridPositionX = this.mouse.x - (this.mouse.x % Cell.cellSize);
            const gridPositionY = this.mouse.y - (this.mouse.y % Cell.cellSize);
            if (gridPositionY > Cell.cellSize - 10) {
                for (let i = 0; i < this.defenders.length; i++) {
                    // can't place defender on top of defender
                    if (this.defenders[i].cellX === gridPositionX && this.defenders[i].cellY === gridPositionY) return;
                }
    
                // placing defender
                if (defenderCost) {
                    this.defenders.push(
                        this.controlsBar.selectedDefender === this.controlsBar.archerCard.id ? new Defender(gridPositionX, gridPositionY, this) :
                        this.controlsBar.selectedDefender === this.controlsBar.knightCard.id ? new Knight(gridPositionX, gridPositionY, this) : ''
                    );
                    this.numberOfResources -= defenderCost;
                    this.controlsBar.selectedDefender = 0;
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
            context.fillStyle = 'black';
            context.font = '60px Arial';
            context.fillText('GAME OVER', 135, 330);
        }

        this.gameGrid.forEach(cell => cell.render(context));
        this.controlsBar.render(context);
        this.defenders.forEach(defender => defender.render(context));
        this.enemies.forEach(enemy => enemy.render(context));
        this.projectiles.forEach(projectile => projectile.render(context));
        this.resources.forEach(resource => resource.render(context));
        this.floatingMessages.forEach(message => message.render(context));

        if (this.controlsBar.selectedDefender === this.controlsBar.archerCard.id) {
            context.drawImage(this.controlsBar.archerImage, 0, 0, 200, 200, this.mouse.x - 100, this.mouse.y - 100, 200, 200);
        } else if (this.controlsBar.selectedDefender === this.controlsBar.knightCard.id) {
            context.drawImage(this.controlsBar.knightImage, 0, 0, 200, 200, this.mouse.x - 100, this.mouse.y - 100, 200, 200);
        }
    }

    update(delta) {
        if (this.gameOver) return;

        this.createGrid();

        this.enemyTimer += delta;
        this.resourceTimer += delta;

        // update enemies
        this.enemies.forEach(enemy => {
            enemy.update(delta);
            if (enemy.x < 0) this.gameOver = true;
        });

        // enemy spawn interval
        if (this.enemyTimer >= this.enemiesInterval) {
            this.enemyTimer = 0;
            // vertical position on grid
            const verticalPosition = Math.floor(Math.random() * 5 + 1) * Cell.cellSize;
            const enemyID = Date.now().toString(36) + Math.random().toString(36).substring(2);
            this.enemies.push(new Enemy(verticalPosition, this.canvas.width, this, enemyID));
            this.enemyPositions.push({
                id: enemyID,
                x: this.canvas.width,
                y: verticalPosition
            });
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
                this.floatingMessages.push(new FloatingMessage('+' + resource.amount, resource.x, resource.y, 20, 'black'));
                this.resources = this.resources.filter(el => el !== resource);
            }
        });

        // luck gradually increase
        // if (this.luck <= 0) this.luck += 0.0001 * delta;
        //console.log(this.luck);
        // update defenders
        this.defenders.forEach(defender => defender.update(delta));

        // update projectiles
        this.projectiles.forEach(projectile => {
            projectile.update(this);
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