import Phaser from "phaser";
import ContentDTO from "../dto/ContentDTO";

export default class DetailContentScene extends Phaser.Scene {
    private headerTitleText!: Phaser.GameObjects.Text;
    private contentText!: Phaser.GameObjects.Text;
    private backButton!: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "DetailContentScene" });
    }

    init(data: any): void {
        const { header } = data;
        console.log("Received header:", header);
        this.createContent(header);
    }

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

        this.backButton = this.add
            .text(this.scale.width * 0.05, this.scale.height * 0.05, "Back", {
                fontFamily: "Arial",
                fontSize: `${this.scale.width * 0.04}px`,
                color: "#FFF",
                backgroundColor: "#4CAF50",
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
                stroke: "#000",
                strokeThickness: 3,
            })
            .setInteractive()
            .setOrigin(0);

        this.backButton.on("pointerup", () => {
            this.scene.stop("DetailContentScene");
            this.scene.start("GamePlayScene");
        });
    }
}
