import FloatingMessage from './FloatingMessage.js';

export default class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.power = 20;
        this.speed = 5;
        this.spriteSize = 32;
        this.image = new Image();
        this.image.src = '../images/Arrow.png';
    }

    update(game) {
        this.x += this.speed;

        //collision with enemies
        game.enemies.forEach(enemy => {
            if (game.checkCollision(enemy, this) && !enemy.dying) {
                enemy.health -= this.power;
                game.projectiles = game.projectiles.filter(projectile => projectile !== this);     
                if (enemy.health <= 0) {
                    const coinImage = new Image();
                    coinImage.src = "../images/Coin.png"
                    game.floatingMessages.push(new FloatingMessage('', enemy.x, enemy.y, 16, 'black', coinImage));
                    game.gold += enemy.maxHealth / 2;
                    enemy.dying = true;
                    game.enemyPositions = game.enemyPositions.filter(el => el.id !== enemy.id);
                }   
            }
        });
    }

    render(context) {
        // context.save();
        // context.fillStyle = 'black';
        // context.beginPath();
        // context.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        // context.fill();
        // context.restore();
        context.drawImage(
            this.image, 
            0, 
            0, 
            this.spriteSize, 
            this.spriteSize, 
            this.x,
            this.y, 
            this.width, 
            this.height
        );
    }
}

export class Fireball extends Projectile {
    constructor(x, y) {
        super(x, y);
        this.image.src = '../images/Fireball2.png';
        this.power = 40;
        this.spriteSize = 22;
        this.width = 22;
        this.height = 22;
    }
}

export class Voidball extends Fireball {
    constructor(x, y) {
        super(x, y);
        this.image.src = '../images/Voidball.png';
        this.power = 60;
    }
}