import config from './config.js'



class Game extends Phaser.Game {
    constructor () {
        super(config)
    }
}

window.onload = () => {
    Window.game = new Game()
}