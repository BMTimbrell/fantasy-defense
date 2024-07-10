export default class FloatingMessage {
    constructor(value, x, y, size, color) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.lifespan = 0;
        this.color = color;
        this.size = size;
        this.opacity = 1;
    }

    update(game) {
        this.y -= 0.3;
        this.lifespan += 1;
        
        if (this.lifespan >= 50) game.floatingMessages = game.floatingMessages.filter(message => message !== this);
        if (this.opacity > 0.03) this.opacity -= 0.03;
    }

    render(context) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.font = this.size + 'px Arial';
        context.fillText(this.value, this.x, this.y);
        context.globalAlpha = 1;
        context.restore();
    }
}