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
        this.speed = 0.01;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.goldDropped = 50;
        this.dying = false;
        this.dead = false;
        this.game = game;
        // spritesheet is flipped
        this.walkingFrame = 5;
        this.attackingFrame = 5;
        this.attackFrame = 2;
        this.dyingFrame = 5;
        this.idleFrame = 5;
        this.frameX = 5;
        this.frameY = 1;
        this.minFrame = 0;
        this.maxFrame = 5;
        this.animationTimer = 0;
        this.animationInterval = 150;
        this.attackInterval = 500;
        this.damageTrigger = false;
        this.attackTimer = this.attackInterval;
        this.image = new Image();
        this.image.src = './images/Slime.png';
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
                            defender.health -= 25;
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
                        this.colliding--;
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
                case 'idle':
                    // reset attacking animation
                    this.attackingFrame = this.maxFrame;
                    this.minFrame = this instanceof OrcRider ? 5 : this instanceof ArmouredOrc ? 3: this instanceof Werewolf ? 7 : this instanceof Skeleton ? 2 : 0;
                    this.frameY = 0;

                    // spritesheet is flipped
                    if (this.idleFrame > this.minFrame) {
                        this.idleFrame--;
                    }
                    else this.idleFrame = this.maxFrame;
            
                    this.frameX = this.idleFrame;
                    break;

                case 'walking':
                    // reset attacking animation
                    this.attackingFrame = this.maxFrame;
                    this.minFrame = this instanceof OrcRider ? 3 : this instanceof ArmouredOrc ? 1 : this instanceof Werewolf ? 7 : 0;
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
                    this.walkingFrame = this.maxFrame;
                    this.minFrame = this instanceof Skeleton || this instanceof ArmouredOrc || this instanceof OrcRider ? 2 : 
                        this instanceof Werewolf ? 4 : 0;

                    this.frameY = this instanceof OrcRider ? 3 : 2;

                    // spritesheet is flipped
                    if (this.attackingFrame > this.minFrame) {
                        this.attackingFrame--;
                    }
                    else {
                        this.attackingFrame = this.maxFrame;
                        this.attackTimer = 0;
                    }
            
                    this.frameX = this.attackingFrame;

                    // damage defender on this frame
                    if (this.attackingFrame === this.attackFrame) this.damageTrigger = true;
                    break;
                case 'dying':
                    this.frameY = this instanceof Werebear ? 6 :
                        this instanceof Orc || this instanceof Werewolf ? 5 :
                        this instanceof Skeleton ? 6 : 
                        this instanceof ArmouredOrc || this instanceof OrcRider ? 7 : 4;

                    this.minFrame = this instanceof OrcRider ? 7 : 
                        this instanceof Skeleton ? 4 : 
                        this instanceof ArmouredOrc ? 5 : 
                        this instanceof Werewolf ? 9 : 2;

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

export class Skeleton extends Enemy {
    constructor(verticalPosition, canvas, game, id) {
        super(verticalPosition, canvas, game, id);
        this.image.src = './images/Skeleton.png';
        this.speed = 0.02;
        this.walkingFrame = 7;
        this.attackingFrame = 7;
        this.dyingFrame = 7;
        this.maxFrame = 7;
        this.attackFrame = 4;
        this.goldDropped = 60;
    }
}

export class Orc extends Skeleton {
    constructor(verticalPosition, canvas, game, id) {
        super(verticalPosition, canvas, game, id);
        this.image.src = './images/Orc.png';
        this.speed = 0.01;
        this.maxHealth = 140;
        this.health = this.maxHealth;
        this.goldDropped = 55;
    }
}

export class ArmouredOrc extends Enemy {
    constructor(verticalPosition, canvas, game, id) {
        super(verticalPosition, canvas, game, id);
        this.image.src = './images/ArmouredOrc.png';
        this.maxHealth = 200;
        this.health = this.maxHealth;
        this.maxFrame = 8;
        this.walkingFrame = 8;
        this.attackingFrame = 8;
        this.dyingFrame = 8;
        this.attackFrame = 3;
        this.goldDropped = 60;
    }
}

export class Werewolf extends Enemy {
    constructor(verticalPosition, canvas, game, id) {
        super(verticalPosition, canvas, game, id);
        this.image.src = './images/Werewolf.png';
        this.maxFrame = 12;
        this.walkingFrame = 12;
        this.attackingFrame = 12;
        this.dyingFrame = 12;
        this.attackFrame = 6;
        this.goldDropped = 65;
        this.speed = 0.03
    }
}

export class Werebear extends  Werewolf {
    constructor(verticalPosition, canvas, game, id) {
        super(verticalPosition, canvas, game, id);
        this.image.src = './images/Werebear.png';
        this.speed = 0.02;
        this.maxHealth = 140;
        this.health = this.maxHealth;
    }
}

export class OrcRider extends  Enemy {
    constructor(verticalPosition, canvas, game, id) {
        super(verticalPosition, canvas, game, id);
        this.image.src = './images/OrcRider.png';
        this.speed = 0.02;
        this.maxHealth = 200;
        this.health = this.maxHealth;
        this.goldDropped = 70;
        this.maxFrame = 10;
        this.walkingFrame = 10;
        this.attackingFrame = 10;
        this.dyingFrame = 10;
        this.attackFrame = 4;
    }
}