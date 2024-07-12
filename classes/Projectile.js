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
            if (game.checkCollision(enemy, this)) {
                enemy.health -= this.power;
                game.projectiles = game.projectiles.filter(projectile => projectile !== this);     
                if (enemy.health <= 0) {
                    game.gold += enemy.maxHealth / 2;
                    game.enemyPositions = game.enemyPositions.filter(el => el.id !== enemy.id);
                    game.enemies = game.enemies.filter(el => el !== enemy);
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