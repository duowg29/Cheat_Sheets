import Phaser from "phaser";

export default class CardService {
    static createCard(
        scene: Phaser.Scene,
        x: number,
        y: number,
        header: string,
        text: string
    ): Phaser.GameObjects.Container {
        const cardWidth = scene.scale.width * 0.3;
        const cardHeight = scene.scale.height * 0.2;
        const padding = 10;

        const card = scene.add.container(x, y);

        const background = scene.add
            .rectangle(0, 0, cardWidth, cardHeight, 0xffffff)
            .setStrokeStyle(3, 0x000000)
            .setOrigin(0.5);

        const headerText = scene.add
            .text(0, -cardHeight / 2 + padding, header, {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.015}px`,
                fontStyle: "bold",
                color: "#222",
                align: "center",
                wordWrap: {
                    width: cardWidth - padding * 2,
                    useAdvancedWrap: true,
                },
            })
            .setOrigin(0.5, 0);

        const contentText = scene.add.text(
            -cardWidth / 2 + padding,
            -cardHeight / 2 + 90,
            text,
            {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.012}px`,
                color: "#222",
                wordWrap: {
                    width: cardWidth - padding * 2,
                    useAdvancedWrap: true,
                },
                align: "left",
            }
        );

        card.add([background, headerText, contentText]);
        return card;
    }
}
