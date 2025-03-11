export default class GamePlayScene extends Phaser.Scene {
    private cheatsheets: {
        title: string;
        content: { header: string; text: string }[];
    }[] = [];
    private currentIndex: number = 0;
    private titleText!: Phaser.GameObjects.Text;
    private cards: Phaser.GameObjects.Container[] = [];

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

        this.titleText = this.add
            .text(this.scale.width / 2, 40, "", {
                fontSize: "28px",
                color: "#333",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.add
            .image(50, this.scale.height / 2, "leftButton")
            .setInteractive()
            .on("pointerdown", () => this.changePage(-1));
        this.add
            .image(this.scale.width - 50, this.scale.height / 2, "rightButton")
            .setInteractive()
            .on("pointerdown", () => this.changePage(1));

        this.updatePage();
    }

    private createCard(
        x: number,
        y: number,
        header: string,
        text: string
    ): Phaser.GameObjects.Container {
        const cardWidth = 300;
        const cardHeight = 200;
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
                fontSize: "22px",
                fontStyle: "bold",
                color: "#222",
            }
        );

        const contentText = this.add.text(
            -cardWidth / 2 + 15,
            -cardHeight / 2 + 50,
            text,
            {
                fontSize: "16px",
                color: "#444",
                wordWrap: { width: cardWidth - 30 },
            }
        );

        card.add([background, headerText, contentText]);
        return card;
    }

    private updatePage(): void {
        const cheat = this.cheatsheets[this.currentIndex];

        this.cards.forEach((card) => card.destroy());
        this.cards = [];

        this.titleText.setText(cheat.title);

        const cols = 2;
        const rows = Math.ceil(cheat.content.length / cols);
        const cardWidth = 320;
        const cardHeight = 220;
        const startX = this.scale.width / 2 - (cols - 1) * (cardWidth / 2);
        const startY = this.scale.height / 2 - (rows - 1) * (cardHeight / 2);

        cheat.content.forEach((item, index) => {
            const x = startX + (index % cols) * cardWidth;
            const y = startY + Math.floor(index / cols) * cardHeight;
            this.cards.push(this.createCard(x, y, item.header, item.text));
        });
    }

    private changePage(direction: number): void {
        this.currentIndex = Phaser.Math.Wrap(
            this.currentIndex + direction,
            0,
            this.cheatsheets.length
        );
        this.updatePage();
    }
}
