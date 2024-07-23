export default class finalFeliz extends Phaser.Scene {
    constructor () {
      super('finalFeliz')
    }
  
    preload () { }
  
    create () {
      // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
      this.mensagem = this.add.text(100, 50, 'Parabéns! Você conseguiu!', {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'Courier New'
      })
        .setInteractive()
        .on('pointerdown', () => {
          location.reload()
        })
  
      // Inicializa o Google Sign-In
      google.accounts.id.initialize({
        client_id: '112780069165-5kgjsh6duhib02u3ai3s55hn2scirsn6.apps.googleusercontent.com',
        callback: (res) => {
          if (res.error) {
            console.error(res.error)
          } else {
            globalThis.game.jwt = jwtDecode(res.credential)
            this.mensagem.setText(`Parabéns, ${globalThis.game.jwt.given_name}!`)
          }
        }
      })
  
      // Exibe o prompt de login
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          google.accounts.id.prompt()
        }
      })
    }
  
    update () { }
  }