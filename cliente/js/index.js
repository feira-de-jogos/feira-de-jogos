import config from './config.js'



class Game extends Phaser.Game {
    constructor () {
        super(config)

        this.scene.add('abertura', abertura)
        this.scene.start('abertura')
    }
}

window.onload = () => {
    Window.game = new Game()
}