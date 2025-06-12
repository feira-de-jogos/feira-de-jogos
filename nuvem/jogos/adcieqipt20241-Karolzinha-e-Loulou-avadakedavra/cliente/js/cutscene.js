import Phaser from 'phaser'

export default class Cutscene extends Phaser.Scene {
  constructor () {
    super('cutscene')
    this.currentCutscene = 0 // Índice da cutscene atual
    this.cutscenes = [
      { image: 'cutscene1', text: 'Bem-vindos, jovens \nguardiões. Há muito \ntempo, a floresta de \nEldorya era um \nlugar de vida, \nmagia e harmonia.' },
      { image: 'cutscene2', text: 'Mas uma força sombria \nse ergueu das \nprofundezas, corroendo \na essência da \nfloresta e ameaçando \ntodo o nosso mundo.' },
      { image: 'cutscene3', text: 'Vocês foram escolhidos \npara restaurar o \nequilíbrio e deverão \ntrabalhar juntos para \nlivrar a floresta do \nmal que se espalha.' },
      { image: 'cutscene4', text: 'Ao longo da missão, \nencontrarão cristais \npor toda Eldorya. \nReúnam todos, pois \nserá crucial para o \nequilíbrio da floresta.' },
      { image: 'cutscene5', text: 'Além disso, as três \nessências da floresta \ntambém foram perdidas. \nAo serem coletadas, \nfortalecerão vocês \npara enfrentar \nnovos desafios.' },
      { image: 'cutscene6', text: 'Infelizmente, criaturas \nda floresta foram \ncorroídas pelas trevas. \nAntes inofensivas, \nagora estão sob a \ninfluência do mal e \nse tornaram hostis.' },
      { image: 'cutscene7', text: 'Ao enfrentá-las, \nlembrem que estarão \nlibertando elas desse \ntormento e ajudando \na restaurar o \nequilíbrio da floresta.' },
      { image: 'cutscene8', text: 'Cuidado! A floresta \nestá cheia de perigos \nalém das criaturas \ncorrompidas. Buracos \nprofundos e armadilhas \nestão pelo caminho.' },
      { image: 'cutscene9', text: 'E lembrem-se, a \ncooperação entre vocês \nserá a chave para \no sucesso. O \ndestino da floresta \nestá em suas mãos.' },
      { image: 'cutscene10', text: 'Agora, vão, e que \na luz de Eldorya \nguie seus passos.' }
    ]
    this.textAnimationActive = false // Flag para verificar se a animação de texto está ativa
  }

  preload () {
    // Carregar todas as imagens necessárias
    this.load.image('cutscene1', './assets/cutscenes/CUTSCENE1.png')
    this.load.image('cutscene2', './assets/cutscenes/CUTSCENE2.png')
    this.load.image('cutscene3', './assets/cutscenes/CUTSCENE3.png')
    this.load.image('cutscene4', './assets/cutscenes/CUTSCENE4.png')
    this.load.image('cutscene5', './assets/cutscenes/CUTSCENE5.png')
    this.load.image('cutscene6', './assets/cutscenes/CUTSCENE6.png')
    this.load.image('cutscene7', './assets/cutscenes/CUTSCENE7.png')
    this.load.image('cutscene8', './assets/cutscenes/CUTSCENE8.png')
    this.load.image('cutscene9', './assets/cutscenes/CUTSCENE9.png')
    this.load.image('cutscene10', './assets/cutscenes/CUTSCENE10.png')
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
        this.scene.start('mapa') // Inicia a cena de mapa
        this.scene.stop('cutscene') // Para a cena de cutscene atual
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
