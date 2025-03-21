import Phaser from "phaser";
import ContentDTO from "../dto/ContentDTO";

export default class DetailContentScene extends Phaser.Scene {
    private headerTitleText!: Phaser.GameObjects.Text;
    private contentText!: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "DetailContentScene" });
    }

    init(data: any): void {
        const { header } = data;
        console.log("Received header:", header);
        this.createContent(header);
    }

    preload(): void {}

    createContent(header: any): void {
        if (!header || !header.contents) {
            console.error("Header or header.contents is undefined");
            return;
        }

        this.background = this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0xffffff)
            .setOrigin(0)
            .setDepth(-1);

        this.headerTitleText = this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.1,
                header.title,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.06}px`,
                    color: "#333",
                    fontStyle: "bold",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        const contentString = header.contents
            .map((content: ContentDTO) => content.text)
            .join("\n\n");

        this.contentText = this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.5,
                contentString,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.015}px`,
                    color: "#555",
                    align: "center",
                    wordWrap: {
                        width: this.scale.width * 0.8,
                        useAdvancedWrap: true,
                    },
                }
            )
            .setOrigin(0.5);

        if (header.image) {
            const { path, x, y, width, height, rotation } = header.image;

            this.load.image(path, path);

            this.load.once("complete", () => {
                this.add
                    .image(x, y, path)
                    .setOrigin(0.5)
                    .setDisplaySize(width, height)
                    .setRotation(Phaser.Math.DegToRad(rotation));
            });

            this.load.start();
        }

        const backButton = this.add
            .text(this.scale.width * 0.03, this.scale.height * 0.03, "Back", {
                fontFamily: "Arial",
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#FFF",
                backgroundColor: "#000",
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            })
            .setInteractive()
            .setOrigin(0);

        backButton.on("pointerover", () => {
            backButton.setScale(1.1);
        });
        backButton.on("pointerout", () => {
            backButton.setScale(1);
        });

        backButton.on("pointerup", () => {
            this.scene.stop("DetailContentScene");
            this.scene.start("GamePlayScene");
        });
    }
}
