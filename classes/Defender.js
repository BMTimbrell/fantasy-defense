import Cell from './Cell.js';
import Projectile, { Fireball, Voidball } from './Projectile.js';
import FloatingMessage from './FloatingMessage.js';

export default class Defender {
    constructor(cellX, cellY, game) {
        this.width = 32;
        this.height = 40;
        this.cellX = cellX;
        this.cellY = cellY;
        // hitbox position
        this.x = this.cellX + 40;
        this.y = this.cellY + (Cell.cellSize - this.height) / 2;
        this.attacking = false;
        this.maxHealth = 100;
        this.health = this.maxHealth;
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
        this.image.src = './images/Archer.png';
    }

    render(context) {

        if (!(this instanceof Witch)) {
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
        } else {
            context.drawImage(
                this.image, 
                this.frameX * 64, 
                this.frameY * 64, 
                64, 
                64, 
                this.cellX + (Cell.cellSize - 64) / 2 + 5, 
                this.cellY + (Cell.cellSize - 64) / 2 - 15, 
                64, 
                64
            );
        }

        
        if (this.game.checkCollision(this.game.mouse, this)) {
            context.fillStyle = 'gray';
            context.fillRect(this.x - 10, this.y - 15, 40, 5);
            context.fillStyle = 'lime';
            context.fillRect(this.x - 10, this.y - 15, this.health / this.maxHealth * 40, 5);
            context.fillStyle = 'black';
            context.strokeRect(this.x - 9, this.y - 14, 41, 6);
        }
    }

    update(delta) {

        if (this.dead) this.game.defenders = this.game.defenders.filter(el => el !== this);
        if (this.dying) {
            this.animate('dying');
        }

        // knight check for enemies
        let numberOfEnemies = 0;

        // priest check for heal
        if (this instanceof Priest && !this.dying) {
            let defenders = 0;
            this.game.defenders.forEach(defender => {
                if (defender.cellY === this.cellY && defender.cellX === this.cellX + Cell.cellSize && !defender.dying) {
                    if (defender.health < defender.maxHealth) defenders++;
                    else defenders = 0;
                }
            });

            if (this.attacking || defenders || this.attackTimer < this.attackInterval) {
                this.attacking = true;
            }
            // reset healing timer once ally full health and most of healing timer is finished. Stops bug with skipping healing animation
            if (!defenders && this.attackTimer > this.attackInterval - 50 && this.attackTimer < this.attackInterval) this.attacking = false;
            

        // check for enemy to attack
        } else if (!(this instanceof Knight) && this.game.enemyPositions.find(pos => pos.y === this.cellY && pos.x > this.x && pos.x < this.game.canvas.width - 20) && !this.dying) {
            this.attacking = true;
        } else if (this instanceof Knight && !this.dying) {
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
                    this.attackTrigger = false;
                    if (this instanceof Knight) {
                        // damage any enemies colliding
                        this.game.enemies.forEach(enemy => {
                            if (this.game.checkCollision(enemy, this) && !enemy.dying) {
                                enemy.health -= 20;    
                                if (enemy.health <= 0) {
                                    const coinImage = new Image();
                                    coinImage.src = "./images/Coin.png"
                                    this.game.floatingMessages.push(new FloatingMessage('', enemy.x, enemy.y, 16, 'black', coinImage));
                                    this.game.gold += enemy.maxHealth / 2;
                                    numberOfEnemies--;
                                    enemy.dying = true;
                                    this.game.enemyPositions = this.game.enemyPositions.filter(el => el.id !== enemy.id);
                                }   
                            }
                        });
                    } else {
                        // priest heal
                        if (this instanceof Priest) {
                            this.game.defenders.forEach(defender => {
                                if (defender.cellY === this.cellY && defender.cellX === this.cellX + Cell.cellSize) {
                                    defender.health += Math.abs(defender.health - defender.maxHealth) >= 50 ? 50 : defender.maxHealth % defender.health;
                                }
                            });
                        // fire projectiles
                        } else {
                            this.game.projectiles.push(
                                this instanceof Witch ? new Voidball(this.cellX + 50, this.cellY + 45) : 
                                this instanceof Wizard ? new Fireball(this.cellX + 50, this.cellY + 45) : 
                                new Projectile(this.cellX + 20, this.cellY + 32)
                            );
                        }
                    }
                }
                // change to attacking animation
                this.animate('attacking');
            } else {
                this.animate('idle');
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
                    this.frameY = this instanceof Priest ? 5 : this instanceof Wizard ? 6 : 2;

                    this.maxFrame = this.maxAttackingFrame;

                    if (this.attackingFrame < this.maxFrame) {
                        this.attackingFrame++;
                    } else {
                        this.attackingFrame = this.minFrame;
                        this.attackTimer = 0;
                    }
            
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
        this.image.src = './images/Knight.png';
        this.maxAttackingFrame = 6;
        this.attackFrame = 3;
        this.dyingFrameY = 7;
        this.maxHealth = 500;
        this.health = this.maxHealth;
    }
}


export class Priest extends Defender {
    constructor(cellX, cellY, game) {
        super(cellX, cellY, game);
        this.image.src = './images/Priest.png';
        this.maxAttackingFrame = 5;
        this.attackFrame = 3;
        this.dyingFrameY = 9;
    }
}

export class Wizard extends Defender {
    constructor(cellX, cellY, game) {
        super(cellX, cellY, game);
        this.image.src = './images/Wizard.png';
        this.maxAttackingFrame = 5;
        this.attackFrame = 4;
        this.dyingFrameY = 9;
    }
}

export class Witch extends Defender {
    constructor(cellX, cellY, game, health = 100) {
        super(cellX, cellY, game);
        this.image.src = './images/Witch.png';
        this.maxAttackingFrame = 7;
        this.attackFrame = 4;
        this.dyingFrameY = 4;
        this.maxIdleFrame = 3;
        this.maxFrame = 3;
        this.attackTimer = 0;
        this.health = health;
    }
}