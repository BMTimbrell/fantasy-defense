export default class FloatingMessage {
    constructor(value, x, y, size, color, image = null, speed = 0.03, opacitySpeed = 0.003) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.lifespan = 0;
        this.speed = speed;
        this.opacitySpeed = opacitySpeed;
        this.color = color;
        this.size = size;
        this.opacity = 1;
        this.image = image;
    }

    update(game, delta) {
        this.y -= this.speed * delta;
        this.lifespan += delta;
        
        if (this.lifespan >= 2000) game.floatingMessages = game.floatingMessages.filter(message => message !== this);
        if (this.opacity > 0.03) this.opacity -= this.opacitySpeed * delta;
        if (this.opacity < 0) this.opacity = 0;
    }

    render(context) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.font = this.size + 'px Pixel';
        context.fillText(this.value, this.x, this.y);
        if (this.image) {
            context.drawImage(
                this.image, 
                0, 
                0, 
                this.size, 
                this.size, 
                this.x, 
                this.y, 
                this.size, 
                this.size
            );
        }
        context.globalAlpha = 1;
        context.restore();
    }
}