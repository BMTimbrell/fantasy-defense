import Cell from './Cell.js';

export default class Enemy {
    constructor(verticalPosition, canvas, game) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.height = Cell.cellSize;
        this.width = Cell.cellSize;
        this.speed = 4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.game = game;
    }

    update() {
        this.x -= this.movement;
        
        this.game.defenders.forEach((defender) => {
            if (this.game.checkCollision(defender, this)) {
                defender.health -= 0.2;
                this.movement = 0;
                if (defender.health <= 0) {
                    this.game.defenders = this.game.defenders.filter(el => el !== defender);
                    this.movement = this.speed;
                }
            }
        });
    }

    render(context) {
        context.save();
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        context.restore();
    }
}