import Cell from './Cell.js';

export default class Enemy {
    constructor(verticalPosition, horizontalPosition, game, id) {
        this.id = id;
        this.cellX = horizontalPosition;
        this.cellY = verticalPosition;
        this.height = 40;
        this.width = 44;
        this.spriteSize = 200;
        // center hitbox inside cell
        this.x = this.cellX + (Cell.cellSize - this.width) / 2;
        this.y = this.cellY + (Cell.cellSize - this.height) / 2;
        this.speed = 0.04;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.game = game;
        this.walkingFrame = 0;
        this.attackingFrame = 0;
        this.frameX = 0;
        this.frameY = 1;
        this.minFrame = 0;
        this.maxFrame = 5;
        this.animationTimer = 0;
        this.animationInterval = 200;
        this.attackTimer = 0;
        this.attackInterval = 100;
        this.image = new Image();
        this.image.src = '../images/Slime.png';
        this.colliding = 0;
    }

    update(delta) {
        this.game.enemyPositions.forEach(pos => {
            if (pos.id === this.id) pos.x = this.x;
            return;
        });

        this.animationTimer += delta;
        this.x -= this.movement * delta;
        this.cellX = this.x;

        this.colliding = 0;

        this.game.defenders.forEach((defender) => {
            if (this.game.checkCollision(defender, this)) {
                this.animate('attacking');
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

        if (!this.colliding) {
            this.movement = this.speed;
            this.animate('walking');
        } 
    }

    render(context) {
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        context.drawImage(
            this.image, 
            this.frameX * this.spriteSize, 
            this.frameY * this.spriteSize, 
            this.spriteSize, 
            this.spriteSize, 
            this.cellX + (Cell.cellSize - this.spriteSize) / 2 - 30, 
            this.cellY + (Cell.cellSize - this.spriteSize) / 2,
            this.spriteSize, 
            this.spriteSize
        );
    }

    animate(animation) {

        if (this.animationTimer >= this.animationInterval) {
            this.animationTimer = 0;
            switch (animation) {
                case 'walking':
                    this.frameY = 1;

                    if (this.walkingFrame < this.maxFrame) {
                        this.walkingFrame++;
                    }
                    else this.walkingFrame = this.minFrame;
            
                    this.frameX = this.walkingFrame;
                    break;
                case 'attacking':
                    this.frameY = 2;

                    if (this.attackingFrame < this.maxFrame) {
                        this.attackingFrame++;
                    }
                    else this.attackingFrame = this.minFrame;
            
                    this.frameX = this.attackingFrame;
                    break;
                default:
                    break;
            }
            
        }

    }
}

export class Slime extends Enemy {
    constructor(verticalPosition, canvas, game) {
        super(verticalPosition, canvas, game);
    }
}