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
    this.input.addPointer(3)
    
    this.add.image(427, 240, 'teladeselecao')

    this.Leo = this.add.image(220, 250, 'vazioparaselecao')
      .setInteractive()
      .on('pointerdown', () => {
        globalThis.game.socket.emit('escolher-personagem', globalThis.game.sala, { id: globalThis.game.socket.id, local: 'LeoVen', remoto: 'BenVen' })
      })

    this.Ben = this.add.image(650, 250, 'vazioparaselecao')
      .setInteractive()
      .on('pointerdown', () => {
        globalThis.game.socket.emit('escolher-personagem', globalThis.game.sala, { id: globalThis.game.socket.id, local: 'BenVen', remoto: 'LeoVen' })
      })

    globalThis.game.socket.on('personagem-escolhido', ({ id, local, remoto }) => {
      if (globalThis.game.socket.id === id) {
        globalThis.game.personagemLocal = local
        globalThis.game.personagemRemoto = remoto
        this.scene.stop('selecaopersonagem')
        this.scene.start('mapa')
      } else {
        globalThis.game.personagemLocal = remoto
        globalThis.game.personagemRemoto = local
        this.scene.stop('selecaopersonagem')
        this.scene.start('mapa')
      }
    })
  }

  update () { }
}
