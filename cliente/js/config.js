export default {
  type: Phaser.AUTO,
  width: 800,
  height: 750,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false // colocar em true para enxergar hitbox.
      
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 750
  }
}
