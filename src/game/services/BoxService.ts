import Phaser from "phaser";

export default class BoxService {
    static createBox(
        scene: Phaser.Scene,
        x: number,
        y: number,
        title: string,
        text: string
    ): Phaser.GameObjects.Container {
        const boxWidth = scene.scale.width * 0.35;
        const boxHeight = scene.scale.height * 0.25;
        const padding = 12;

        const box = scene.add.container(x, y);

        const background = scene.add
            .rectangle(0, 0, boxWidth, boxHeight, 0xffffff)
            .setStrokeStyle(4, 0x000000)
            .setOrigin(0.5)
            .setSize(boxWidth, boxHeight)
            .setInteractive();

        const titleText = scene.add
            .text(0, -boxHeight / 2 + padding, title, {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.02}px`,
                fontStyle: "bold",
                color: "#000",
                align: "center",
                wordWrap: {
                    width: boxWidth - padding * 2,
                    useAdvancedWrap: true,
                },
            })
            .setOrigin(0.5, 0);

        const contentText = scene.add.text(
            -boxWidth / 2 + padding,
            -boxHeight / 2 + 90,
            text,
            {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.015}px`,
                color: "#000",
                wordWrap: {
                    width: boxWidth - padding * 2,
                    useAdvancedWrap: true,
                },
                align: "left",
            }
        );

        box.add([background, titleText, contentText]);

        box.setInteractive().on("pointerup", () => {
            console.log(`Box selected: ${title}`);
            scene.scene.start("DetailContentScene", {
                header: { title, text },
            });
        });

        box.setSize(boxWidth, boxHeight);

        return box;
    }
}
