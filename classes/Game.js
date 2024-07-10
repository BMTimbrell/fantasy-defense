import Cell from './Cell.js';
import ControlsBar from './ControlsBar.js';
import Defender from './Defender.js';
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
        };
        this.canvasPosition = canvas.getBoundingClientRect();
        this.gameOver = false;

        this.defenders = [];
        this.numberOfResources = 300;
        this.gold = 0;
        this.luck = -7;
        this.resources = [];
        this.projectiles = [];

        this.floatingMessages = [];

        this.enemies = [];
        this.enemiesInterval = 600;
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

        this.canvas.addEventListener('click', () => {
            const gridPositionX = this.mouse.x - (this.mouse.x % Cell.cellSize);
            const gridPositionY = this.mouse.y - (this.mouse.y % Cell.cellSize);
            if (gridPositionY < Cell.cellSize) return;
            for (let i = 0; i < this.defenders.length; i++) {
                if (this.defenders[i].x === gridPositionX && this.defenders[i].y === gridPositionY) return;
            }

            let defenderCost = 100;
            if (this.numberOfResources >= defenderCost) {
                this.defenders.push(new Defender(gridPositionX, gridPositionY, this));
                this.numberOfResources -= defenderCost;
            } else {
                this.floatingMessages.push(new FloatingMessage('need more resources', this.mouse.x, this.mouse.y, 20, 'red'));
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
    }

    update(frame) {
        if (this.gameOver) return;

        this.createGrid();

        // update enemies
        this.enemies.forEach(enemy => {
            enemy.update();
            if (enemy.x < 0) this.gameOver = true;
        });
        // enemy spawn interval
        if (frame % this.enemiesInterval === 0) {
            // vertical position on grid
            let verticalPosition = Math.floor(Math.random() * 5 + 1) * Cell.cellSize;
            this.enemies.push(new Enemy(verticalPosition, this.canvas, this));
            this.enemyPositions.push(verticalPosition);
        }

        // spawn resources
        if (frame % 500 === 0) {
            this.resources.push(new Resource(this));
        }

        // collision with resources
        this.resources.forEach(resource => {
            if (this.mouse.x && this.mouse.y && this.checkCollision(resource, this.mouse)) {
                this.numberOfResources += resource.amount;
                this.floatingMessages.push(new FloatingMessage('+' + resource.amount, resource.x, resource.y, 20, 'black'));
                this.floatingMessages.push(new FloatingMessage('+' + resource.amount, 220, 50, 30, 'gold'));
                this.resources = this.resources.filter(el => el !== resource);
            }
        });

        // luck gradually increase
        if (this.luck <= 5) this.luck += 0.001;
        console.log(this.luck);

        // update defenders
        this.defenders.forEach(defender => defender.update());

        // update projectiles
        this.projectiles.forEach(projectile => {
            projectile.update(this);
            if (projectile.x > this.canvas.width - Cell.cellSize) {
                this.projectiles = this.projectiles.filter(el => el !== projectile);
            }
        });

        // floating messages
        this.floatingMessages.forEach(message => message.update(this));

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