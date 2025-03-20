import Phaser from "phaser";
import BoxService from "../services/BoxService";
import ContentDTO from "../dto/ContentDTO";

export default class MenuContentScene extends Phaser.Scene {
    private cheatsheet: any;
    private currentHeaderIndex: number = 0;
    private boxes: Phaser.GameObjects.Container[] = [];
    private maxBoxesPerPage: number = 6;
    private scrollIndex: number = 0;

    private upButton!: Phaser.GameObjects.Text;
    private downButton!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "MenuContentScene" });
    }

    init(data: any): void {
        if (!data || !data.cheatsheet) {
            console.error("No cheatsheet data found in MenuContentScene");
            return;
        }
        this.cheatsheet = data.cheatsheet;
    }

    create(): void {
        const cheatsheetTitleText = this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.05,
                this.cheatsheet.name,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.04}px`,
                    fontStyle: "bold",
                    color: "#000",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        if (!this.cheatsheet || !this.cheatsheet.headers) {
            console.error(
                "Cheatsheet or headers are missing in MenuContentScene."
            );
            return;
        }

        const headers = this.cheatsheet.headers;

        headers.forEach((header: any, index: number) => {
            const row = Math.floor(index / 2);
            const col = index % 2;

            const boxX = this.scale.width * (0.3 + col * 0.4);
            const boxY = this.scale.height * (0.25 + row * 0.25);

            const box = BoxService.createBox(
                this,
                boxX,
                boxY,
                header.title,
                header.contents
                    .map((c: ContentDTO) => c.text)
                    .join("\n")
                    .substring(0, 50) + "..."
            );

            box.setSize(this.scale.width * 0.3, this.scale.height * 0.2);

            box.setInteractive().on("pointerup", () => {
                this.currentHeaderIndex = index;
                this.scene.start("DetailContentScene", {
                    header: header,
                });
            });

            this.boxes.push(box);
        });

        this.upButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.4, "▲", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#FFF",
                backgroundColor: "#000",
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            })
            .setInteractive()
            .setOrigin(0.5);

        this.downButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.6, "▼", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#FFF",
                backgroundColor: "#000",
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            })
            .setInteractive()
            .setOrigin(0.5);

        this.upButton.on("pointerdown", () => this.scrollPage(-1));
        this.downButton.on("pointerdown", () => this.scrollPage(1));

        const backButton = this.add
            .text(this.scale.width * 0.05, this.scale.height * 0.05, "Back", {
                fontFamily: "Arial",
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#FFF",
                backgroundColor: "#000",
                padding: { left: 10, right: 10, top: 5, bottom: 5 },
            })
            .setInteractive()
            .setOrigin(0);

        backButton.on("pointerup", () => {
            this.scene.stop("MenuContentScene");
            this.scene.start("GamePlayScene", { cheatsheet: this.cheatsheet });
        });
    }

    private scrollPage(direction: number): void {
        const totalHeaders = this.cheatsheet.headers.length;

        this.scrollIndex = Phaser.Math.Clamp(
            this.scrollIndex + direction * this.maxBoxesPerPage,
            0,
            Math.max(0, totalHeaders - this.maxBoxesPerPage)
        );

        this.updatePage();
    }

    private updatePage(): void {}
}
