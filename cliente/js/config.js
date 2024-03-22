export default {
type: Phaser.AUTO,
width: 1024,
heigth: 1024,
parent: 'game-container',
physics: {
    default: 'arcade',
    arcade: {
        gravity: {y: 0 },
        debug:true
    }
}
}
