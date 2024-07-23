import Cell from './Cell.js';
import Projectile from './Projectile.js';
import FloatingMessage from './FloatingMessage.js';

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
        this.maxIdleFrame = 5;
        this.attackingFrame = 0;
        // when to attack
        this.attackFrame = 7;
        this.maxAttackingFrame = 8;
        this.dyingFrame = 0;
        this.dyingFrameY = 5;
        this.maxDyingFrame = 3;
        this.attackInterval = 3000;
        this.attackTimer = this.attackInterval;
        this.attackTrigger = false;
        this.spriteSize = 200;
        this.image = new Image();
        this.image.src = '../images/Archer.png';
    }

    render(context) {
        // context.fillStyle = 'blue';
        // context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'gold';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y);

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
        // knight check for enemies
        let numberOfEnemies = 0;
        if (!(this instanceof Knight) && this.game.enemyPositions.find(pos => pos.y === this.cellY && pos.x > this.x) && !this.dying) this.attacking = true;
        else if (this instanceof Knight && !this.dying) {
            this.game.enemies.forEach(enemy => {
                if (this.game.checkCollision(enemy, this) && !enemy.dying) {
                    numberOfEnemies++;
                }
               if (numberOfEnemies) this.attacking = true;
               else this.attacking = false;
            });
        } else this.attacking = false;

        this.animationTimer += delta;

        // attacking
        if (this.attacking) {
            // attacking interval
            if (this.attackTimer < this.attackInterval) this.attackTimer += delta;
            if (this.attackTimer >= this.attackInterval) {
                if (this.attackTrigger) {
                    if (this instanceof Knight) {
                        // damage any enemies colliding
                        this.game.enemies.forEach(enemy => {
                            if (this.game.checkCollision(enemy, this) && !enemy.dying) {
                                enemy.health -= 20;    
                                if (enemy.health <= 0) {
                                    const coinImage = new Image();
                                    coinImage.src = "../images/Coin.png"
                                    this.game.floatingMessages.push(new FloatingMessage('', enemy.x, enemy.y, 16, 'black', coinImage));
                                    this.game.gold += enemy.maxHealth / 2;
                                    numberOfEnemies--;
                                    enemy.dying = true;
                                    this.game.enemyPositions = this.game.enemyPositions.filter(el => el.id !== enemy.id);
                                }   
                            }
                        });
                    } else {
                        this.game.projectiles.push(new Projectile(this.cellX + 20, this.cellY + 32));
                    }
                    this.attackTrigger = false;
                }
                // change to attacking animation
                this.animate('attacking');
            } else {
                this.animate('idle');
            }

            if (this.attackingFrame === this.maxFrame) {
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
                    this.maxFrame = this.maxIdleFrame;

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
                    this.maxFrame = this.maxAttackingFrame;

                    if (this.attackingFrame < this.maxFrame) {
                        this.attackingFrame++;
                    }
                    else this.attackingFrame = this.minFrame;
            
                    this.frameX = this.attackingFrame;

                    if (this.frameX === this.attackFrame) {
                        this.attackTrigger = true;
                    }
                    break;
                case 'dying':
                    this.frameY = this.dyingFrameY;
                    this.maxFrame = this.maxDyingFrame;

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

export class Knight extends Defender {
    constructor(cellX, cellY, game) {
        super(cellX, cellY, game);
        this.image.src = '../images/Knight.png';
        this.maxAttackingFrame = 6;
        this.attackFrame = 3;
        this.dyingFrameY = 7;
        this.health = 500;
    }
}