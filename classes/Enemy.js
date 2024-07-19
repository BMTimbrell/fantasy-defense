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
        this.dying = false;
        this.dead = false;
        this.game = game;
        // spritesheet is flipped
        this.walkingFrame = 5;
        this.attackingFrame = 5;
        this.dyingFrame = 5;
        this.frameX = 5;
        this.frameY = 1;
        this.minFrame = 0;
        this.maxFrame = 5;
        this.animationTimer = 0;
        this.animationInterval = 200;
        this.attackInterval = 100;
        this.damageTrigger = false;
        this.attackTimer = this.attackInterval;
        this.image = new Image();
        this.image.src = '../images/Slime.png';
        this.colliding = 0;
    }

    update(delta) {
        if (this.dead) this.game.enemies = this.game.enemies.filter(el => el !== this);
        if (!this.dying) this.game.enemyPositions.forEach(pos => {
            if (pos.id === this.id) pos.x = this.x;
            return;
        });

        this.animationTimer += delta;
        if (this.dying) {
            this.animate('dying');
        } else {
            this.x -= this.movement * delta;
            this.cellX = this.x;
    
            // stops bug where multiple enemies collide and one kills defender then other enemies don't resume movement
            this.colliding = 0;
    
            this.game.defenders.forEach((defender) => {
                if (this.game.checkCollision(defender, this) && this.x > defender.x && defender.dying === false) {
                    // attack interval
                    if (this.attackTimer < this.attackInterval) this.attackTimer += delta;
                    if (this.attackTimer >= this.attackInterval) {
                        // change to attacking animation
                        this.animate('attacking');
                        if (this.damageTrigger) {
                            defender.health -= 20;
                            this.damageTrigger = false;
                        }
                        
                    } else {
                        this.animate('idle');
                    }
                    this.colliding++;
                    this.movement = 0;
                    if (defender.health <= 0) {
                        defender.dying = true;
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

    }

    render(context) {
        // context.fillStyle = 'red';
        // context.fillRect(this.x, this.y, this.width, this.height);
        // context.fillStyle = 'black';
        // context.font = '20px Arial';
        // context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
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
                    // reset attacking animation
                    this.attackingFrame = 5;

                    this.frameY = 1;

                    // spritesheet is flipped
                    if (this.walkingFrame > this.minFrame) {
                        this.walkingFrame--;
                    }
                    else this.walkingFrame = this.maxFrame;
            
                    this.frameX = this.walkingFrame;
                    break;
                case 'attacking':
                    // reset walking animation
                    this.walkingFrame = 5;

                    this.frameY = 2;

                    // spritesheet is flipped
                    if (this.attackingFrame > this.minFrame) {
                        this.attackingFrame--;
                    }
                    else this.attackingFrame = this.maxFrame;
            
                    this.frameX = this.attackingFrame;

                    // damage defender on this frame
                    if (this.attackingFrame === 2) this.damageTrigger = true;
                    break;
                case 'dying':
                    this.frameY = 4;
                    this.minFrame = 2;

                    if (this.dyingFrame > this.minFrame) {
                        this.dyingFrame--;
                    } else this.dead = true;
            
                    this.frameX = this.dyingFrame;
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