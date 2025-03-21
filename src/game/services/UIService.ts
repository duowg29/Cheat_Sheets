import Phaser from "phaser";

export default class UIService {
    static createClassButtons(
        scene: Phaser.Scene,
        classes: any[],
        currentClassIndex: number,
        callback: (index: number) => void
    ): Phaser.GameObjects.Text[] {
        const buttons: Phaser.GameObjects.Text[] = [];
        const buttonWidth = scene.scale.width * 0.15;
        const buttonHeight = scene.scale.height * 0.05;
        const buttonSpacing = scene.scale.width * 0.02;

        classes.forEach((cls, index) => {
            const buttonY =
                scene.scale.width * 0.1 +
                index * (buttonHeight + buttonSpacing);
            const button = scene.add
                .text(scene.scale.width * 0.05, buttonY, cls.title, {
                    fontFamily: "Arial",
                    fontSize: `${scene.scale.width * 0.02}px`,
                    color: index === currentClassIndex ? "#000" : "#FFF",
                    backgroundColor:
                        index === currentClassIndex ? "#FFD700" : "#000",
                    padding: { left: 10, right: 10, top: 5, bottom: 5 },
                })
                .setInteractive()
                .setOrigin(0.5);
            button.on("pointerover", () => {
                button.setScale(1.1); // Enlarge the button when hovered
            });

            button.on("pointerout", () => {
                button.setScale(1); // Reset scale when hover ends
            });
            button.on("pointerdown", () => callback(index));
            buttons.push(button);
        });

        return buttons;
    }

    static updateClassButtons(
        buttons: Phaser.GameObjects.Text[],
        currentClassIndex: number
    ) {
        buttons.forEach((button, index) => {
            button.setColor(index === currentClassIndex ? "#000" : "#FFF");
            button.setBackgroundColor(
                index === currentClassIndex ? "#FFD700" : "#000"
            );
        });
    }
}
