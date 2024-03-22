export default class sala extends Phaser.Scene {
    constructor () {
      super('sala')
    }
  
      preload() {
        this.load.image('fundo', './assets/fundo.png')
      }
      create() {
        this.add.image(400,255,'fundo')
        this.add.text(100, 50, 'sala 1').setInteractive().on('pointerdown', () => {})
        }
  
      update(){
      }
  }
  