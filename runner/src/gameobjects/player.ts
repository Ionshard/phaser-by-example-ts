class Player extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;
  jumping: boolean;
  invincible: boolean;
  health: number;
  constructor(scene: Phaser.Scene, x: number, y: number, number?: number) {
    super(scene, x, y, 32, 32, 0x00ff00);
    this.setOrigin(0.5);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.collideWorldBounds = true;
    this.setScale(1);
    this.jumping = false;
    this.invincible = false;
    this.health = 10;
    this.body.mass = 10;
    this.body.setDragY(10);
  }
}

export default Player;
