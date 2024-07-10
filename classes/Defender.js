import Cell from './Cell.js';
import Projectile from './Projectile.js';

export default class Defender {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = Cell.cellSize;
        this.height = Cell.cellSize;
        this.shooting = false;
        this.health = 100;
        this.timer = 0;
        this.game = game;
    }

    render(context) {
        context.fillStyle = 'blue';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'gold';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    }

    update() {
        // check for enemy to shoot
        if (this.game.enemyPositions.find(pos => pos === this.y)) this.shooting = true;
        else this.shooting = false;

        if (this.shooting) {
            this.timer++;
            if (this.timer % 100 === 0) {
                this.game.projectiles.push(new Projectile(this.x, this.y));
            }
        } else {
            this.timer = 0;
        }
    }
}