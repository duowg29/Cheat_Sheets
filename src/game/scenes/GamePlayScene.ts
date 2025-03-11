export default class GamePlayScene extends Phaser.Scene {
    private cheatsheets: { title: string; content: string }[] = [
        {
            title: "Công thức toán học",
            content: "a^2 + b^2 = c^2 (Định lý Pythagoras)",
        },
        {
            title: "Hình học",
            content: "Diện tích hình tròn: A = πr^2",
        },
    ];

    private currentIndex: number = 0;
    private contentText!: Phaser.GameObjects.Text;
    private titleText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "GamePlayScene" });
    }

    create(): void {
        // Kiểm tra xem dữ liệu có sẵn không
        if (!this.cheatsheets || this.cheatsheets.length === 0) {
            console.error("Lỗi: Không có dữ liệu JSON");
            return;
        }

        // Thêm tiêu đề
        this.titleText = this.add
            .text(this.scale.width / 2, 50, "", {
                fontSize: "24px",
                color: "#000000",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Thêm nội dung
        this.contentText = this.add
            .text(this.scale.width / 2, 100, "", {
                fontSize: "18px",
                color: "#000000",
                wordWrap: { width: this.scale.width - 40 },
            })
            .setOrigin(0.5, 0);

        // Nút trái
        this.add
            .image(50, this.scale.height / 2, "leftButton")
            .setInteractive()
            .on("pointerdown", () => this.changePage(-1));

        // Nút phải
        this.add
            .image(this.scale.width - 50, this.scale.height / 2, "rightButton")
            .setInteractive()
            .on("pointerdown", () => this.changePage(1));

        // Hiển thị nội dung trang đầu tiên
        this.updatePage();
    }

    private changePage(direction: number): void {
        this.currentIndex = Phaser.Math.Wrap(
            this.currentIndex + direction,
            0,
            this.cheatsheets.length
        );
        this.updatePage();
    }

    private updatePage(): void {
        const cheat = this.cheatsheets[this.currentIndex];
        this.titleText.setText(cheat.title);
        this.contentText.setText(cheat.content);
    }
}
