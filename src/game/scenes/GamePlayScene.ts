import ClassDTO from "../dto/ClassDTO";
import DataService from "../services/DataService";
import UIService from "../services/UIService";
import NavigationService from "../services/NavigationService";
import CardService from "../services/CardService";

export default class GamePlayScene extends Phaser.Scene {
    private classes: ClassDTO[] = [];
    private currentClassIndex: number = 0;
    private currentCheatsheetIndex: number = 0;
    private scrollIndex: number = 0;

    private classButtons: Phaser.GameObjects.Text[] = [];
    private cheatsheetNameText!: Phaser.GameObjects.Text;
    private cards: Phaser.GameObjects.Container[] = [];
    private maxCardsPerPage: number = 6;
    private upButton!: Phaser.GameObjects.Text;
    private downButton!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "GamePlayScene" });
    }

    preload(): void {
        this.load.json("cheatsheets", "assets/cheatsheets.json");
    }

    create(): void {
        const jsonData = this.cache.json.get("cheatsheets");
        this.classes = DataService.loadClasses(jsonData);

        this.classButtons = UIService.createClassButtons(
            this,
            this.classes,
            this.currentClassIndex,
            (index: number) => {
                this.currentClassIndex = index;
                this.currentCheatsheetIndex = 0;
                this.scrollIndex = 0;
                UIService.updateClassButtons(
                    this.classButtons,
                    this.currentClassIndex
                );
                this.updatePage();
            }
        );

        this.cheatsheetNameText = this.add
            .text(this.scale.width * 0.5, this.scale.height * 0.1, "", {
                fontSize: `${this.scale.width * 0.02}px`,
                color: "#000",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        NavigationService.setupKeyboardControls(
            this,
            (dir) => this.changeCheatsheet(dir),
            (dir) => this.scrollPage(dir)
        );

        // Thêm các nút mũi tên lên/xuống
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

        this.updatePage();
    }

    private changeCheatsheet(direction: number): void {
        this.currentCheatsheetIndex = Phaser.Math.Wrap(
            this.currentCheatsheetIndex + direction,
            0,
            this.classes[this.currentClassIndex].cheatsheets.length
        );
        this.scrollIndex = 0;
        this.updatePage();
    }

    private scrollPage(direction: number): void {
        const currentCheatsheet =
            this.classes[this.currentClassIndex].cheatsheets[
                this.currentCheatsheetIndex
            ];
        const totalHeaders = currentCheatsheet.headers.length;

        this.scrollIndex = Phaser.Math.Clamp(
            this.scrollIndex + direction * this.maxCardsPerPage,
            0,
            Math.max(0, totalHeaders - this.maxCardsPerPage)
        );

        this.updatePage();
    }

    private updatePage(): void {
        const currentCheatsheet =
            this.classes[this.currentClassIndex].cheatsheets[
                this.currentCheatsheetIndex
            ];
        this.cheatsheetNameText.setText(currentCheatsheet.name);

        this.cards.forEach((card) => card.destroy());
        this.cards = [];

        const headersToShow = currentCheatsheet.headers.slice(
            this.scrollIndex,
            this.scrollIndex + this.maxCardsPerPage
        );

        headersToShow.forEach((header, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;

            const cardX = this.scale.width * (0.3 + col * 0.4);
            const cardY = this.scale.height * (0.3 + row * 0.2);

            const card = CardService.createCard(
                this,
                cardX,
                cardY,
                header.title,
                header.contents.map((c) => c.text).join("\n")
            );
            this.cards.push(card);
        });
    }
}
