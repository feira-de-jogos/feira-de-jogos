export default class abertura extends Phaser.Game {
  constructor () {
    super('abertura')
  }

    preload(){
      this.preload.image('fundo', 'assets/logo.png')
    }

    create(){
      this.add.image(400, 225, 'fundo')
    }

    update(){
    }
}
