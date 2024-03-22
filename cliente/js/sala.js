export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload() {
    this.load.image('fundo', './assets/teste.png')
    this.load.audio('iniciar', './assets/audio.mp3')
    //this.load.audio('musica mapa','./assets/')
  } // colocar após a barrinha o plano de fundo, lembrando que deve importa-lo para o assets. IMPORTANTE: um arquivo seria o da imagem e o outro seria o áudio.
  //basta colocar o mesmo comando para o audio, lembrando que este é o áudio para iniciar o jogo, entrar no jogo.
  //A música mapa seria a musica de plano de fundo 

  create() {
    this.iniciar = this.sound.add('iniciar')
    //this.sound.add('musica mapa', {loop:true}).play()

    this.add.image(427, 240, 'fundo')

    this.add.text(100, 50, 'sala 1')
      .setInteractive()
      .on('pointerdown', () => {
        this.iniciar.play()
      })
  }

  update() {
  }
}
