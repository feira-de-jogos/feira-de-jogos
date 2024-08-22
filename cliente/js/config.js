import Phaser from 'phaser'

export default {
  type: Phaser.AUTO,
  width: 900,
  height: 450,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false // hitbox e vetores de força (COLOCAR FALSE QUANDO O JOGO ESTIVER PRONTO)
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 900,
    height: 450
  }
}
