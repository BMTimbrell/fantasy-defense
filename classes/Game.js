import Cell from './Cell.js';
import ControlsBar from './ControlsBar.js';
import Defender from './Defender.js';

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
        this.defenders = [];
        this.numberOfResources = 200;

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
                this.defenders.push(new Defender(gridPositionX, gridPositionY));
                this.numberOfResources -= defenderCost;
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
        this.gameGrid.forEach(cell => cell.render(context));
        this.controlsBar.render(context);
        this.defenders.forEach(defender => defender.render(context));
    }

    update() {
        this.createGrid();
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