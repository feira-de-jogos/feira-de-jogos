export default class Cutscene extends Phaser.Scene {
  constructor () {
    super('cutscene');
    this.currentCutscene = 0; // Índice da cutscene atual
    this.cutscenes = [
      { image: 'cutscene1', text: "Dois astronautas da NASA, o Comandante Alex e a Engenheira \nStella, partem em uma missão espacial urgente: explorar o \nuniverso e encontrar um novo planeta habitável para \nos seres humanos." },
      { image: 'cutscene2', text: "A viagem começa bem, cheia de esperança e com ambos\nanimados e preparados para as descobertas que os aguardam \nno espaço profundo. No entanto, durante a navegação, \nalgo inesperado acontece…" },
      { image: 'cutscene3', text: "UM OBJETO DESCONHECIDO COLIDE COM A NAVE, danificando \ngravemente os sistemas principais. Com os motores falhando \ne alarmes soando, Alex e Stella precisam agir \nrapidamente." },
      { image: 'cutscene4', text: "Eles realizam uma manobra de emergência e direcionam a nave \npara o planeta mais próximo, realizando um pouso forçado \nem um local desconhecido. Ambos sobrevivem, embora a \nnave tenha sofrido grandes danos." },
      { image: 'cutscene5', text: "Sem as peças de reposição necessárias a bordo, Alex e \nStella decidem explorar o planeta em busca de materiais \npara os reparos. Durante a exploração, eles se deparam \ncom uma imensa construção aparentemente humana…" },
      { image: 'cutscene6', text: "Colete todas as engrenagens para que Alex e Stella \nconsigam consertar a nave e retornar para casa." }
    ];
    this.textAnimationActive = false; // Flag para verificar se a animação de texto está ativa
    this.defaultMusic = 'cutsom'; // Nome da música padrão
  }

  preload () {
    // Carregar todas as imagens necessárias
    this.load.image('cutscene1', './assets/cutscenes/CUTSCENE1.png');
    this.load.image('cutscene2', './assets/cutscenes/CUTSCENE2.png');
    this.load.image('cutscene3', './assets/cutscenes/CUTSCENE3.png');
    this.load.image('cutscene4', './assets/cutscenes/CUTSCENE4.png');
    this.load.image('cutscene5', './assets/cutscenes/CUTSCENE5.png');
    this.load.image('cutscene6', './assets/cutscenes/CUTSCENE6.png');
    this.load.image('nada', './assets/nada.png');

    // Carregar as músicas
    this.load.audio('cutsom', './assets/sons/cutsom.mp3'); //
    this.load.audio('alarm', './assets/sons/alarm.mp3'); //
  }

  create () {
    console.log("Cena criada");

    this.nadaImage = this.add.image(700, 400, 'nada').setInteractive();
    this.textObject = this.add.text(50, 335, "", {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#ffffff',
      align: 'left',
      wordWrap: { width: 800 },
      lineSpacing: 7
    }).setDepth(2); // Ajusta a profundidade do texto para garantir que está visível

    // Adicionar as músicas
    this.backgroundMusic = this.sound.add('cutsom');
    this.alarmSound = this.sound.add('alarm');

    this.nadaImage.on('pointerdown', () => {
      if (this.textAnimationActive) {
        return; // Não avança se a animação de texto estiver ativa
      }

      if (this.currentCutscene === this.cutscenes.length - 1) {
        this.scene.start('mapa'); // Inicia a cena de mapa
        this.backgroundMusic.stop()
        this.scene.stop('cutscene'); // Para a cena de cutscene atual
      } else {
        this.currentCutscene = (this.currentCutscene + 1) % this.cutscenes.length;
        console.log("Mudando para a cutscene:", this.currentCutscene);
        this.updateCutscene();
      }
    });

    this.updateCutscene();
  }

  updateCutscene () {
    // Remove a imagem da cutscene anterior
    if (this.cutsceneImage) {
      this.cutsceneImage.destroy();
    }

    // Remove o texto da cutscene anterior e limpa o evento de tempo
    if (this.textAnimationActive) {
      this.time.removeAllEvents();
      this.textObject.setText("");
      this.textAnimationActive = false;
    }

    // Adiciona a nova imagem de cutscene
    this.cutsceneImage = this.add.image(400, 225, this.cutscenes[this.currentCutscene].image).setDepth(1);

    // Atualiza o texto
    const text = this.cutscenes[this.currentCutscene].text;
    console.log("Texto Atual:", text); // Verifica o texto atual
    this.textObject.setText(""); // Certifique-se de limpar o texto anterior

    let i = 0;
    this.textAnimationActive = true; // Marca que a animação de texto está ativa
    this.time.addEvent({
      delay: 35,
      callback: () => {
        if (i < text.length) {
          this.textObject.text += text[i];
          i++;
        } else {
          this.time.removeAllEvents(); // Para o evento quando o texto estiver completo
          this.textAnimationActive = false; // Marca que a animação de texto está concluída
          console.log("Texto Completo:", this.textObject.text); // Verifica o texto completo
        }
      },
      loop: true
    });

    // Reproduz o som correspondente à cutscene atual
    if (this.currentCutscene === 2) { // Índice 4 corresponde à cutscene 5
      this.alarmSound.play({ loop: true }); // Reproduz o som em loop
      if (this.backgroundMusic.isPlaying) {
        this.backgroundMusic.stop(); // Para a música padrão se estiver tocando
      }
    } else {
      if (!this.backgroundMusic.isPlaying) {
        this.backgroundMusic.play({ loop: true }); // Reproduz a música padrão se não estiver tocando
      }
      if (this.alarmSound.isPlaying) {
        this.alarmSound.stop(); // Para o som de alarme se estiver tocando
      }
    }
  }

  update () { }
}
