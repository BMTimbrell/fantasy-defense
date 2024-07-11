import Game from './classes/Game.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
const game = new Game(canvas);

let lastTime = 0;
function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    game.update(deltaTime);
    lastTime = timestamp;
    requestAnimationFrame(animate);
}

animate(0);