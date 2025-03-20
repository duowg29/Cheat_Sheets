import Phaser from "phaser";
import ContentDTO from "../dto/ContentDTO";

export default class DetailContentScene extends Phaser.Scene {
    private headerTitleText!: Phaser.GameObjects.Text;
    private contentText!: Phaser.GameObjects.Text;
    private backButton!: Phaser.GameObjects.Text;

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

        this.headerTitleText = this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.1,
                header.title,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.04}px`,
                    color: "#000",
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
                this.scale.height * 0.25,
                contentString,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#222",
                    align: "left",
                    wordWrap: {
                        width: this.scale.width * 0.8,
                        useAdvancedWrap: true,
                    },
                }
            )
            .setOrigin(0.5);

        //
        // this.backButton = this.add
        //     .text(this.scale.width * 0.05, this.scale.height * 0.05, "Back", {
        //         fontFamily: "Arial",
        //         fontSize: `${this.scale.width * 0.03}px`,
        //         color: "#FFF",
        //         backgroundColor: "#000",
        //         padding: { left: 10, right: 10, top: 5, bottom: 5 },
        //     })
        //     .setInteractive()
        //     .setOrigin(0);

        //
        // this.backButton.on("pointerup", () => {
        //     this.scene.stop("DetailContentScene");
        //     this.scene.start("MenuContentScene", {
        //         cheatsheet: this.cache.json.get("cheatsheets"),
        //     });
        // });
    }
}
