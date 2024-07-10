export default class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
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
                    game.enemyPositions.splice(game.enemyPositions.indexOf(enemy.y), 1);
                    game.enemies = game.enemies.filter(el => el !== enemy);
                }   
            }
        });
    }

    render(context) {
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        context.fill();
    }
}