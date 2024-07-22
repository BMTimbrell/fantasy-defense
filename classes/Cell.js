export default class Cell {
    static cellSize = 100;

    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = Cell.cellSize;
        this.height = Cell.cellSize;
        this.game = game;
    }

    render(context) {
        // if (this.game.checkCollision(this, this.game.mouse)) {
        //     context.strokeStyle = 'black';
        //     context.strokeRect(this.x, this.y, this.width, this.height);
        // }
    }

}