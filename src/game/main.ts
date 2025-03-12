import { AUTO, Game } from "phaser";
import Boot from "./scenes/Boot";
import LoadingScene from "./scenes/LoadingScene";
import MainGame from "./scenes/Game";
import GamePlayScene from "./scenes/GamePlayScene";

//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: "phaser-example",
    backgroundColor: "#FFFFFF",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: 1920,
            height: 1080,
        },
        min: {
            width: 480,
            height: 270,
        },
    },

    pixelArt: false,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true,
            debugShowVelocity: false,
        },
    },
    scene: [GamePlayScene],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
