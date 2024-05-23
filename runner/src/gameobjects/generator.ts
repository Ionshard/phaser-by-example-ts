import Game from "../scenes/game";

export default class Generator {
  scene: Game;
  pinos: number;
  constructor(scene: Game) {
    this.scene = scene;
    this.scene.time.delayedCall(2000, () => this.init(), undefined, this);
    this.pinos = 0;
  }

  init() {
    this.generateCloud();
    this.generateObstacle();
    this.generateCoin();
  }
  /*
This is the function that generates the clouds. It creates a new cloud and then calls itself again after a random amount of time.

This is done using the Phaser `time.delayedCall` function.
*/
  generateCloud() {
    new Cloud(this.scene);
    this.scene.time.delayedCall(
      Phaser.Math.Between(2000, 3000),
      () => this.generateCloud(),
      undefined,
      this
    );
  }

  generateObstacle() {
    this.scene.obstacles.add(
      new Obstacle(
        this.scene,
        800,
        this.scene.height - Phaser.Math.Between(32, 128)
      )
    );
    this.scene.time.delayedCall(
      Phaser.Math.Between(1500, 2500),
      () => this.generateObstacle(),
      undefined,
      this
    );
  }

  generateCoin() {
    this.scene.coins.add(
      new Coin(
        this.scene,
        800,
        this.scene.height - Phaser.Math.Between(32, 128)
      )
    );
    this.scene.time.delayedCall(
      Phaser.Math.Between(500, 1500),
      () => this.generateCoin(),
      undefined,
      this
    );
  }
}

/*
This is a game object that represents a cloud. It's a simple rectangle with a random size and position. We use a tween to move it from right to left, and then destroy it when it's out of the screen.
*/
export class Cloud extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;
  constructor(scene: Phaser.Scene, x = 800, y = Phaser.Math.Between(0, 100)) {
    /**
     * **Typescript addition**
     * In the JS version:
     * - undefined was passed as x but then the tween in init would immediately set it to 800
     * - undefined was passed as y but then finalY was set to a random value between 0 and 100
     *
     * So to make Typescript happy we instead use the default values in the constructor signature
     */
    super(scene, x, y, 98, 32, 0xffffff);
    scene.add.existing(this);
    const alpha = 1 / Phaser.Math.Between(1, 3);

    this.setScale(alpha);
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 800, to: -100 },
      duration: 2000 / this.scale,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

/*
This is a game object that represents an obstacle. It works exactly like the cloud, but it's a red rectangle that is part of the obstacles group that we created in the `game` scene. It can kill the player if it touches it.
*/
export class Obstacle extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 32, 32, 0xff0000);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    const alpha = 1 / Phaser.Math.Between(1, 3);

    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 820, to: -100 },
      duration: 2000,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

/*
This is a game object that represents a coin. It's an animated sprite that is part of the coins group that we created in the `game` scene. It moves like the previous cloud and the obstacle objects.

It can increase the player's score if it touches it.
*/
export class Coin extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "coin");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    const alpha = 1 / Phaser.Math.Between(1, 3);

    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      x: { from: 820, to: -100 },
      duration: 2000,
      onComplete: () => {
        this.destroy();
      },
    });

    const coinAnimation = this.scene.anims.create({
      key: "coin",
      frames: this.scene.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
    });
    this.play({ key: "coin", repeat: -1 });
  }
}
