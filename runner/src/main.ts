import Phaser from "phaser";
import Game from "./scenes/game";
import GameOver from "./scenes/gameover";
/*
This is the main configuration file for the game.
*/
const config: Phaser.Types.Core.GameConfig = {
  width: 600,
  height: 300,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 350 },
      debug: true,
    },
  },
  scene: [Game, GameOver],
};

export const game = new Phaser.Game(config);
