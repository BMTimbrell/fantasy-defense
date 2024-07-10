import Game from './classes/Game.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
const game = new Game(canvas);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    game.update();
    requestAnimationFrame(animate);
}

animate();