export default class sala extends Phaser.Scene {
    constructor () {
      super('sala')
    }
  
      preload() {
        this.load.image('fundo2', './assets/fundo2.png')
      }
      create() {
        this.add.image(400,255,'fundo2')
        this.add.text(100, 50, 'sala 1')
        .setInteractive()
        .on('pointerdown', () => {
            this.iniciar.play()
        })
        }
  
      update(){
      }
  }
  