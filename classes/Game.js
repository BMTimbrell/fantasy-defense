import Cell from './Cell.js';
import ControlsBar from './ControlsBar.js';
import Defender from './Defender.js';
import Enemy from './Enemy.js';

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
        this.resources = 200;
        this.gold = 0;
        this.projectiles = [];

        this.enemies = [];
        this.enemiesInterval = 600;
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
            if (this.resources >= defenderCost) {
                this.defenders.push(new Defender(gridPositionX, gridPositionY, this));
                this.resources -= defenderCost;
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
    }

    update(frame) {
        if (this.gameOver) return;

        this.createGrid();

        // update enemies
        this.enemies.forEach(enemy => {
            enemy.update();
            if (enemy.x < 0) this.gameOver = true;
        });
        if (frame % this.enemiesInterval === 0) {
            // vertical position on grid
            let verticalPosition = Math.floor(Math.random() * 5 + 1) * Cell.cellSize;
            this.enemies.push(new Enemy(verticalPosition, this.canvas, this));
            this.enemyPositions.push(verticalPosition);
        }

        // update defenders
        this.defenders.forEach(defender => defender.update());

        // update projectiles
        this.projectiles.forEach(projectile => {
            projectile.update(this);
            if (projectile.x > this.canvas.width - Cell.cellSize) {
                this.projectiles = this.projectiles.filter(el => el !== projectile);
            }
        });

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