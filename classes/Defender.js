import Cell from './Cell.js';

export default class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = Cell.cellSize;
        this.height = Cell.cellSize;
        this.shooting = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
    }

    render(context) {
        context.fillStyle = 'blue';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'gold';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    }
}