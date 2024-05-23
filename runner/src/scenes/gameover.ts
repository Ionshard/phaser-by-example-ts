export default class GameOver extends Phaser.Scene {
  width: number;
  height: number;
  center_width: number;
  center_height: number;

  constructor() {
    super({ key: "gameover" });
  }

  create() {
    this.width = Number(this.sys.game.config.width);
    this.height = Number(this.sys.game.config.height);
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.cameras.main.setBackgroundColor(0x87ceeb);

    this.add
      .bitmapText(
        this.center_width,
        50,
        "arcade",
        this.registry.get("score"),
        25
      )
      .setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        this.center_height,
        "arcade",
        "GAME OVER",
        45
      )
      .setOrigin(0.5);
    this.add
      .bitmapText(
        this.center_width,
        250,
        "arcade",
        "Press SPACE or Click to restart!",
        15
      )
      .setOrigin(0.5);
    this.input.keyboard?.on("keydown-SPACE", this.startGame, this);
    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => this.startGame(),
      this
    );
  }

  /**
   * Typescript Addition:
   * To the best of my knowledge, this method is not used anywhere in the codebase.
   *
   * It is attempting to add to an `introLayer` property which is not defined anywhere.
   *
   * So to make Typescript happy (since it doesn't know what `introLayer` is) I just commented it out.
   *
   * However, if I had to make an educated guess I assume it was meant to be a Phaser.GameObjects.Layer
   */
  // showLine(text: string, y:number) {
  //   let line = this.introLayer.add(
  //     this.add
  //       .bitmapText(this.center_width, y, "pixelFont", text, 25)
  //       .setOrigin(0.5)
  //       .setAlpha(0)
  //   );
  //   this.tweens.add({
  //     targets: line,
  //     duration: 2000,
  //     alpha: 1,
  //   });
  // }

  startGame() {
    this.scene.start("game");
  }
}
