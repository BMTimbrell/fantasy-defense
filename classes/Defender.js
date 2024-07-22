import Cell from './Cell.js';
import Projectile from './Projectile.js';

export default class Defender {
    constructor(cellX, cellY, game) {
        this.width = 22;
        this.height = 40;
        this.cellX = cellX;
        this.cellY = cellY;
        // hitbox position
        this.x = this.cellX + 50;
        this.y = this.cellY + (Cell.cellSize - this.height) / 2;
        this.attacking = false;
        this.health = 100;
        this.dying = false;
        this.dead = false;
        this.game = game;
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 5;
        this.animationTimer = 0;
        this.animationInterval = 100;
        this.idleFrame = 0;
        this.attackingFrame = 0;
        this.dyingFrame = 0;
        this.attackInterval = 3000;
        this.attackTimer = this.attackInterval;
        this.spriteSize = 200;
        this.image = new Image();
        this.image.src = '../images/Archer.png';
    }

    render(context) {
        // context.fillStyle = 'blue';
        // context.fillRect(this.x, this.y, this.width, this.height);
        // context.fillStyle = 'gold';
        // context.font = '20px Arial';
        // context.fillText(Math.floor(this.health), this.x + 15, this.y + 30);

        context.drawImage(
            this.image, 
            this.frameX * this.spriteSize, 
            this.frameY * this.spriteSize, 
            this.spriteSize, 
            this.spriteSize, 
            this.cellX + (Cell.cellSize - this.spriteSize) / 2, 
            this.cellY + (Cell.cellSize - this.spriteSize) / 2, 
            this.spriteSize, 
            this.spriteSize
        );

    }

    update(delta) {
        if (this.dead) this.game.defenders = this.game.defenders.filter(el => el !== this);
        if (this.dying) {
            this.animate('dying');
        }
        // check for enemy to attack
        if (this.game.enemyPositions.find(pos => pos.y === this.cellY && pos.x > this.x) && !this.dying) this.attacking = true;
        else this.attacking = false;

        this.animationTimer += delta;

        // attacking
        if (this.attacking) {
            // attacking interval
            if (this.attackTimer < this.attackInterval) this.attackTimer += delta;
            if (this.attackTimer >= this.attackInterval) {
                // change to attacking animation
                this.animate('attacking');
            } else {
                this.animate('idle');
            }

            if (this.attackingFrame === this.maxFrame) {
                this.game.projectiles.push(new Projectile(this.cellX + 20, this.cellY + 32));
                this.attackingFrame = this.minFrame;
                this.attackTimer = 0;
            }
        } else if (!this.dying) {
            // change back to idle
            this.attackTimer = this.attackInterval;
            //reset attacking animation
            this.attackingFrame = 0;
            this.animate('idle');
        }
    }

    animate(animation) {

        if (this.animationTimer >= this.animationInterval) {
            this.animationTimer = 0;
            switch (animation) {
                case 'idle':
                    //reset attacking frame
                    this.attackingFrame = 0;

                    this.frameY = 0;
                    this.maxFrame = 5;

                    if (this.idleFrame < this.maxFrame) {
                        this.idleFrame++;
                    }
                    else this.idleFrame = this.minFrame;
            
                    this.frameX = this.idleFrame;
                    break;
                case 'attacking':
                    // reset idle animation
                    this.idleFrame = 0;

                    this.frameY = 2;
                    this.maxFrame = 8;

                    if (this.attackingFrame < this.maxFrame) {
                        this.attackingFrame++;
                    }
                    else this.attackingFrame = this.minFrame;
            
                    this.frameX = this.attackingFrame;
                    break;
                case 'dying':
                    this.frameY = 5;
                    this.maxFrame = 3;

                    if (this.dyingFrame < this.maxFrame) {
                        this.dyingFrame++;
                    } else this.dead = true;
            
                    this.frameX = this.dyingFrame;
                    break;
                default:
                    break;
            }
            
        }

    }
}