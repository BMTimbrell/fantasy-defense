import Cell from './Cell.js';

export default class Enemy {
    constructor(verticalPosition, canvas, game) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.height = Cell.cellSize;
        this.width = Cell.cellSize;
        this.speed = 0.04;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.game = game;
        this.frameX = 0;
        this.frameY = 1;
        this.minFrame = 0;
        this.maxFrame = 5;
        this.animationTimer = 0;
        this.animationInterval = 200;
        this.spriteSize = 200;
        this.image = new Image();
        this.image.src = '../images/Slime.png';
        this.colliding = 0;
    }

    update(delta) {
        this.animationTimer += delta;
        this.x -= this.movement * delta;
        if (this.animationTimer >= this.animationInterval) {
            this.animationTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }

        this.colliding = 0;

        this.game.defenders.forEach((defender) => {
            if (this.game.checkCollision(defender, this)) {
                this.colliding++;
                defender.health -= 0.2;
                this.movement = 0;
                if (defender.health <= 0) {
                    this.game.defenders = this.game.defenders.filter(el => el !== defender);
                    this.movement = this.speed;
                    this.colliding = 0;
                }
            }
        });

        if (!this.colliding) this.movement = this.speed; 
    }

    render(context) {
        // context.fillStyle = 'red';
        // context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        context.drawImage(
            this.image, 
            this.frameX * this.spriteSize, 
            this.frameY * this.spriteSize, 
            this.spriteSize, 
            this.spriteSize, 
            this.x - 50, 
            this.y - 50, 
            this.width * 2, 
            this.height * 2
        );
    }
}

export class Slime extends Enemy {
    constructor(verticalPosition, canvas, game) {
        super(verticalPosition, canvas, game);
    }
}