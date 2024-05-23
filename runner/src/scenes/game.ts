import Player from "../gameobjects/player";
import Generator, { Coin, Obstacle } from "../gameobjects/generator";
import { Physics } from "phaser";

export default class Game extends Phaser.Scene {
  player: Player | null;
  score: number;
  scoreText: Phaser.GameObjects.BitmapText | null;
  number: number;
  width: number;
  height: number;
  center_width: number;
  center_height: number;
  obstacles: Phaser.GameObjects.Group;
  coins: Phaser.GameObjects.Group;
  generator: Generator;
  SPACE: Phaser.Input.Keyboard.Key;
  updateScoreEvent: Phaser.Time.TimerEvent;
  audios: {
    jump:
      | Phaser.Sound.NoAudioSound
      | Phaser.Sound.HTML5AudioSound
      | Phaser.Sound.WebAudioSound;
    coin:
      | Phaser.Sound.NoAudioSound
      | Phaser.Sound.HTML5AudioSound
      | Phaser.Sound.WebAudioSound;
    dead:
      | Phaser.Sound.NoAudioSound
      | Phaser.Sound.HTML5AudioSound
      | Phaser.Sound.WebAudioSound;
  };
  theme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  jumpTween: any;
  name: string;

  constructor() {
    super({ key: "game" });
    this.player = null;
    this.score = 0;
    this.scoreText = null;
  }

  init(data: { name: string; number: number }) {
    this.name = data.name;
    this.number = data.number;
  }

  /*
    We use the `preload` method to load all the assets that we need for the game.
    We also set the score to 0 in the registry, so we can access it from other scenes.
    */
  preload() {
    this.registry.set("score", "0");
    this.load.audio("coin", "assets/sounds/coin.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("dead", "assets/sounds/dead.mp3");
    this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.spritesheet("coin", "./assets/images/coin.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml"
    );
    this.score = 0;
  }

  /*
Here we do several things.

- We use the `create` method to initialize the game.
- We set some variables to store width and height that we may need later.,
- We set the background color, and create the player, the obstacles, and the coins.
- We also create the keyboard input to listen to the space key.
- Also, we add a collider between the player and the obstacles and an overlap
between the player and the coins. The key part there is to set a function that will be called when the player overlaps with a coin or hits an obstacle.
*/
  create() {
    this.width = Number(this.sys.game.config.width);
    this.height = Number(this.sys.game.config.height);
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x87ceeb);
    this.obstacles = this.add.group();
    this.coins = this.add.group();
    this.generator = new Generator(this);

    if (!this.input.keyboard) throw Error("No keyboard found");

    this.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.player = new Player(this, this.center_width - 100, this.height - 200);
    this.scoreText = this.add.bitmapText(
      this.center_width,
      10,
      "arcade",
      this.score.toString(),
      20
    );

    /**
     * Typescript Addition: The collider callback is typed very poorly in the
     * Phaser types. The type as written completely ignores the actual arguments
     * passed to the callback. Ideally the callback would be typed via generics
     * to allow for the correct types to be passed to the callback. However
     * since this is not possible we will use the `as` keyword to cast the
     * callback to the correct type, which allows the actual function to
     * continue to assume the correct types for it's parameters.
     *
     * See: https://github.com/phaserjs/phaser/issues/5882 P.S.: This issue is
     * the exact reason I am creating this Typescript conversion!
     */
    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.hitObstacle as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.hitCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      () => {
        return true;
      },
      this
    );

    this.loadAudios();
    this.playMusic();

    /*
    We use the `pointerdown` event to listen to the mouse click or touch event.
    */
    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => this.jump(),
      this
    );

    /*
    We use `updateScoreEvent` to update the score every 100ms so the player can see the score increasing as long as he survives.
    */
    this.updateScoreEvent = this.time.addEvent({
      delay: 100,
      callback: () => this.updateScore(),
      callbackScope: this,
      loop: true,
    });
  }

  /*
This method is called when the player hits an obstacle. We stop the updateScoreEvent so the score doesn't increase anymore.

And obviously, we finish the scene.
*/
  hitObstacle(player: Player, obstacle: Obstacle) {
    this.updateScoreEvent.destroy();
    this.finishScene();
  }

  /*
This method is called when the player hits a coin. We play a sound, update the score, and destroy the coin.
*/
  hitCoin(player: Player, coin: Coin) {
    this.playAudio("coin");
    this.updateScore(1000);
    coin.destroy();
  }

  /*
We use this `loadAudios` method to load all the audio files that we need for the game.

Then we'll play them using the `playAudio` method.
*/
  loadAudios() {
    this.audios = {
      jump: this.sound.add("jump"),
      coin: this.sound.add("coin"),
      dead: this.sound.add("dead"),
    };
  }

  playAudio(key: keyof typeof this.audios) {
    this.audios[key].play();
  }

  /*
  This method is specific to the music. We use it to play the theme music in a loop.
  */
  playMusic(theme = "theme") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  /*
This is the game loop. The function is called every frame.

Here is where we can check if a key was pressed or the situation of the player to act accordingly. We use the `update` method to check if the player pressed the space key.
*/
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.jump();
    } else if (this.player?.body.blocked.down) {
      this.jumpTween?.stop();
      this.player.rotation = 0;
      // ground
    }
  }

  /*
This is the method that we use to make the player jump. A jump is just a velocity in the Y-axis. Gravity will do the rest.

We also play a jumping sound and we add a tween to rotate the player while jumping.
*/
  jump() {
    if (!this.player?.body.blocked.down) return;
    this.player.body.setVelocityY(-300);

    this.playAudio("jump");
    this.jumpTween = this.tweens.add({
      targets: this.player,
      duration: 1000,
      angle: { from: 0, to: 360 },
      repeat: -1,
    });
  }

  /*
What should we do when we finish the game scene?

- Stop the theme music
- Play the dead sound
- Set the score in the registry to show it in the `gameover` scene.
- Start the `gameover` scene.

*/
  finishScene() {
    this.theme.stop();
    this.playAudio("dead");
    this.registry.set("score", "" + this.score);
    this.scene.start("gameover");
  }

  /*
This method is called every 100ms and it is used to update the score and show it on the screen.
*/
  updateScore(points = 1) {
    this.score += points;
    this.scoreText?.setText(this.score.toString());
  }
}
