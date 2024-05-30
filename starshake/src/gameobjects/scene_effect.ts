import Game from "../scenes/game";
import Splash from "../scenes/splash";

export default class SceneEffect {
  scene: Splash | Game;

  constructor(scene: Splash | Game) {
    this.scene = scene;
  }

  /*
   This adds a rectangle to the scene, and then we tween it to make it move from the left to the right.
    */
  simpleClose(callback: () => void) {
    const rectangleWidth = this.scene.width / 2;
    const rectangle1 = this.scene.add
      .rectangle(
        0 - rectangleWidth,
        0,
        this.scene.width,
        this.scene.height,
        0x000000
      )
      .setOrigin(0.5, 0);

    this.scene.tweens.add({
      targets: rectangle1,
      duration: 500,
      x: { from: -rectangleWidth / 2, to: rectangleWidth },
      onComplete: () => {
        callback();
      },
    });
  }

  /*
    This adds a rectangle to the scene, and then we tween it to make it move from the right to the left.
    */
  simpleOpen(callback: () => void) {
    const rectangleWidth = this.scene.width / 2;
    const rectangle1 = this.scene.add
      .rectangle(
        rectangleWidth,
        0,
        this.scene.width,
        this.scene.height,
        0x000000
      )
      .setOrigin(0.5, 0);

    this.scene.tweens.add({
      targets: rectangle1,
      duration: 500,
      x: { from: rectangleWidth, to: -rectangleWidth },
      onComplete: () => {
        callback();
      },
    });
  }

  /*
    This adds two rectangles to the scene, and then we tween them to make them move from the center to the left and right.
    */
  close(callback: () => void) {
    const rectangleWidth = this.scene.width / 2;
    const rectangle1 = this.scene.add
      .rectangle(
        0 - rectangleWidth,
        0,
        this.scene.width / 2,
        this.scene.height,
        0x000000
      )
      .setOrigin(0.5, 0);
    const rectangle2 = this.scene.add
      .rectangle(
        this.scene.width,
        0,
        this.scene.width / 2,
        this.scene.height,
        0x000000
      )
      .setOrigin(0, 0);
    this.scene.tweens.add(
      {
        targets: rectangle1,
        duration: 1000,
        x: { from: -rectangleWidth / 2, to: rectangleWidth / 2 },
      }
      /**
       * Typescript Additions: You cannot provide more than one tween to the scene.tweens.add method.
       */
      // {
      //   targets: rectangle2,
      //   duration: 1000,
      //   x: { from: this.scene.width, to: rectangleWidth },
      //   onComplete: () => {
      //     callback();
      //   },
      // }
    );
  }
}
