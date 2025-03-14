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
        const card = scene.add.container(x, y);

        const background = scene.add
            .rectangle(0, 0, cardWidth, cardHeight, 0xffffff)
            .setStrokeStyle(3, 0x000000)
            .setOrigin(0.5);

        const headerText = scene.add.text(
            -cardWidth / 2 + 10,
            -cardHeight / 2 + 10,
            header,
            {
                fontSize: `${scene.scale.width * 0.015}px`,
                fontStyle: "bold",
                color: "#222",
            }
        );

        const contentText = scene.add.text(
            -cardWidth / 2 + 10,
            -cardHeight / 2 + 40,
            text,
            {
                fontSize: `${scene.scale.width * 0.012}px`,
                color: "#444",
                wordWrap: { width: cardWidth - 20 },
            }
        );

        card.add([background, headerText, contentText]);
        return card;
    }
}
