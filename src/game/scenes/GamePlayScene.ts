export default class GamePlayScene extends Phaser.Scene {
    private cheatsheets: {
        title: string;
        content: { header: string; text: string }[];
    }[] = [];
    private currentIndex: number = 0;
    private scrollIndex: number = 0;
    private titleText!: Phaser.GameObjects.Text;
    private cards: Phaser.GameObjects.Container[] = [];
    private maxCardsPerPage: number = 6;
    private titleButtons: Phaser.GameObjects.Text[] = [];
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
        if (!jsonData || jsonData.length === 0) {
            console.error("Lỗi: Không có dữ liệu JSON");
            return;
        }
        this.cheatsheets = jsonData;

        const buttonWidth = this.scale.width * 0.15;
        const buttonHeight = this.scale.height * 0.05;
        const buttonSpacing = this.scale.width * 0.02;

        jsonData.slice(0, 5).forEach((item: any, index: number) => {
            const buttonX =
                this.scale.width * 0.1 + index * (buttonWidth + buttonSpacing);
            const button = this.add
                .text(buttonX, this.scale.height * 0.05, item.title, {
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: index === this.currentIndex ? "#000" : "#FFF",
                    backgroundColor:
                        index === this.currentIndex ? "#FFD700" : "#000",
                    padding: { left: 10, right: 10, top: 5, bottom: 5 },
                })
                .setInteractive()
                .setOrigin(0.5);

            button.on("pointerdown", () => {
                this.currentIndex = index;
                this.scrollIndex = 0;
                this.updatePage();
            });

            this.titleButtons.push(button);
        });

        this.input.keyboard?.on("keydown-LEFT", () => this.changeTitle(-1));
        this.input.keyboard?.on("keydown-RIGHT", () => this.changeTitle(1));
        this.input.keyboard?.on("keydown-UP", () => this.scrollHeaders(-1));
        this.input.keyboard?.on("keydown-DOWN", () => this.scrollHeaders(1));

        // Thêm nút lên/xuống bên phải màn hình
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

        this.upButton.on("pointerdown", () => this.scrollHeaders(-1));
        this.downButton.on("pointerdown", () => this.scrollHeaders(1));

        this.updatePage();
    }

    private changeTitle(direction: number): void {
        this.currentIndex = Phaser.Math.Wrap(
            this.currentIndex + direction,
            0,
            this.cheatsheets.length
        );
        this.scrollIndex = 0;
        this.updatePage();
    }

    private scrollHeaders(direction: number): void {
        this.scrollIndex = Phaser.Math.Clamp(
            this.scrollIndex + direction,
            0,
            this.getMaxScroll()
        );
        this.updatePage();
    }

    private updatePage(): void {
        const cheat = this.cheatsheets[this.currentIndex];
        this.cards.forEach((card) => card.destroy());
        this.cards = [];
        this.titleText?.setText(cheat.title);

        this.titleButtons.forEach((button, index) => {
            button.setColor(index === this.currentIndex ? "#000" : "#FFF");
            button.setBackgroundColor(
                index === this.currentIndex ? "#FFD700" : "#000"
            );
        });

        const startIdx = this.scrollIndex * this.maxCardsPerPage;
        const endIdx = Math.min(
            startIdx + this.maxCardsPerPage,
            cheat.content.length
        );
        const cols = 2;
        const rows = Math.ceil(this.maxCardsPerPage / cols);
        const cardWidth = this.scale.width * 0.4;
        const cardHeight = this.scale.height * 0.2;
        const startX = this.scale.width * 0.3;
        const startY = this.scale.height * 0.3;

        cheat.content.slice(startIdx, endIdx).forEach((item, index) => {
            const x =
                startX + (index % cols) * (cardWidth + this.scale.width * 0.02);
            const y =
                startY +
                Math.floor(index / cols) *
                    (cardHeight + this.scale.height * 0.02);
            this.cards.push(
                this.createCard(x, y, item.header, item.text, cardWidth)
            );
        });
    }

    private createCard(
        x: number,
        y: number,
        header: string,
        text: string,
        cardWidth: number
    ): Phaser.GameObjects.Container {
        const cardHeight = this.scale.height * 0.2;
        const card = this.add.container(x, y);

        const background = this.add
            .rectangle(0, 0, cardWidth, cardHeight, 0xffffff)
            .setStrokeStyle(3, 0x000000)
            .setOrigin(0.5);
        const headerText = this.add.text(
            -cardWidth / 2 + 15,
            -cardHeight / 2 + 15,
            header,
            {
                fontSize: `${this.scale.width * 0.015}px`,
                fontStyle: "bold",
                color: "#222",
                wordWrap: { width: cardWidth - 30 },
            }
        );
        const contentText = this.add.text(
            -cardWidth / 2 + 15,
            -cardHeight / 2 + 50,
            text,
            {
                fontSize: `${this.scale.width * 0.012}px`,
                color: "#444",
                wordWrap: { width: cardWidth - 30 },
            }
        );

        card.add([background, headerText, contentText]);
        return card;
    }

    private getMaxScroll(): number {
        const cheat = this.cheatsheets[this.currentIndex];
        return Math.ceil(cheat.content.length / this.maxCardsPerPage) - 1;
    }
}
