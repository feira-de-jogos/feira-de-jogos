export default class selacaopersonagem extends Phaser.Scene {
  constructor () {
    super('selecaopersonagem')
  }

  preload () {
    // Abertura:
    this.load.image('teladeselecao', './assets/Cenas/teladeselecao.png')
    this.load.image('vazioparaselecao', './assets/Cenas/vazioparaselecao.png')
  }

  create () {
    this.add.image(427, 240, 'teladeselecao')

    this.Leo = this.add.image(220, 250, 'vazioparaselecao')
      .setInteractive()
      .on('pointerdown', () => {
        globalThis.game.personagemLocal = 'LeoVen'
        globalThis.game.personagemRemoto = 'BenVen'
        this.scene.stop('selecaopersonagem')
        this.scene.start('mapa')
      })

    this.Ben = this.add.image(650, 250, 'vazioparaselecao')
      .setInteractive()
      .on('pointerdown', () => {
        globalThis.game.personagemLocal = 'BenVen'
        globalThis.game.personagemRemoto = 'LeoVen'
        this.scene.stop('selecaopersonagem')
        this.scene.start('mapa')
      })
  }

  update () { }
}
