export default {
type: Phaser.AUTO,
width: 800,
heigth: 450,
parent: 'game-container',
physics: {
    default: 'arcade',
    arcade: {
        gravity: {y: 0 },
        debug:true
    }
}
}
