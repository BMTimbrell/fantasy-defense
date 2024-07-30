export default class Cell {
    static cellSize = 100;

    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = Cell.cellSize;
        this.height = Cell.cellSize;
        this.game = game;
        this.image = new Image();
        this.image.src = '../images/grass3.png';
    }

    render(context) {
        // context.drawImage(
        //     this.image, 
        //     0, 
        //     0, 
        //     64, 
        //     64, 
        //     this.x, 
        //     this.y, 
        //     100, 
        //     100
        // );

        if (this.game.checkCollision(this, this.game.mouse) && this.game.controlsBar.selectedDefender) {
             context.strokeStyle = 'black';
             context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

}