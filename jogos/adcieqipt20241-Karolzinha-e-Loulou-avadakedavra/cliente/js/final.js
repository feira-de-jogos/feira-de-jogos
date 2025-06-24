import Phaser from 'phaser'

export default class Cutscene extends Phaser.Scene {
  constructor () {
    super('final')
    this.currentCutscene = 0 // Índice da cutscene atual
    this.cutscenes = [
      { image: 'cutscene1', text: 'Freya e Khal, vocês \nrestauraram a paz e a \nharmonia em Eldorya! \nGraças à sua bravura \ne determinação, a \nfloresta esta em \nequilíbrio novamente.' },
      { image: 'cutscene2', text: 'Que a luz de Eldorya \nbrilhe eternamente em \nseus corações. Sempre \nseremos gratos a vocês, \ne suas lendas serão \ncontadas por gerações.' }
    ]
    this.textAnimationActive = false // Flag para verificar se a animação de texto está ativa
  }

  preload () {
    // Carregar todas as imagens necessárias
    this.load.image('cutscene1', './assets/cutscenes/FINAL1.png')
    this.load.image('cutscene2', './assets/cutscenes/FINAL2.png')
    this.load.image('nada', './assets/nada.png')
  }

  create () {
    console.log('Cena criada')

    this.nadaImage = this.add.image(400, 225, 'nada').setInteractive()
    this.textObject = this.add.text(170, 270, '', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#000000',
      align: 'left',
      wordWrap: { width: 800 },
      lineSpacing: 7
    }).setDepth(2) // Ajusta a profundidade do texto para garantir que está visível

    this.nadaImage.on('pointerdown', () => {
      if (this.textAnimationActive) {
        return // Não avança se a animação de texto estiver ativa
      }

      if (this.currentCutscene === this.cutscenes.length - 1) {
        this.scene.start('finalFeliz') // Inicia a cena de finalfeliz
        this.scene.stop('final') // Para a cena de cutscene atual
      } else {
        this.currentCutscene = (this.currentCutscene + 1) % this.cutscenes.length
        console.log('Mudando para a cutscene:', this.currentCutscene)
        this.updateCutscene()
      }
    })

    this.updateCutscene()
  }

  updateCutscene () {
    // Remove a imagem da cutscene anterior
    if (this.cutsceneImage) {
      this.cutsceneImage.destroy()
    }

    // Remove o texto da cutscene anterior e limpa o evento de tempo
    if (this.textAnimationActive) {
      this.time.removeAllEvents()
      this.textObject.setText('')
      this.textAnimationActive = false
    }

    // Adiciona a nova imagem de cutscene
    this.cutsceneImage = this.add.image(400, 225, this.cutscenes[this.currentCutscene].image).setDepth(1)

    // Atualiza o texto
    const text = this.cutscenes[this.currentCutscene].text
    console.log('Texto Atual:', text) // Verifica o texto atual
    this.textObject.setText('') // Certifique-se de limpar o texto anterior

    let i = 0
    this.textAnimationActive = true // Marca que a animação de texto está ativa
    this.time.addEvent({
      delay: 30,
      callback: () => {
        if (i < text.length) {
          this.textObject.text += text[i]
          i++
        } else {
          this.time.removeAllEvents() // Para o evento quando o texto estiver completo
          this.textAnimationActive = false // Marca que a animação de texto está concluída
          console.log('Texto Completo:', this.textObject.text) // Verifica o texto completo
        }
      },
      loop: true
    })
  }

  update () { }
}
