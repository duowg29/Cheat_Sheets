import Phaser from "phaser";
import BoxService from "../services/BoxService"; // Import BoxService
import ContentDTO from "../dto/ContentDTO"; // Import DTO chứa nội dung

export default class MenuContentScene extends Phaser.Scene {
    private cheatsheet: any; // Dữ liệu cheatsheet được truyền từ GamePlayScene
    private currentHeaderIndex: number = 0; // Chỉ số của header được chọn
    private boxes: Phaser.GameObjects.Container[] = []; // Mảng chứa các box
    private maxBoxesPerPage: number = 6; // Số ô tối đa trên mỗi trang
    private scrollIndex: number = 0; // Chỉ số cuộn trang

    private upButton!: Phaser.GameObjects.Text;
    private downButton!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "MenuContentScene" });
    }

    init(data: any): void {
        // Kiểm tra dữ liệu đã được truyền vào hay chưa
        if (!data || !data.cheatsheet) {
            console.error("No cheatsheet data found in MenuContentScene");
            return;
        }
        this.cheatsheet = data.cheatsheet; // Lấy cheatsheet từ dữ liệu đã truyền từ GamePlayScene
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

        // Kiểm tra lại cheatsheet và headers
        if (!this.cheatsheet || !this.cheatsheet.headers) {
            console.error(
                "Cheatsheet or headers are missing in MenuContentScene."
            );
            return;
        }

        const headers = this.cheatsheet.headers;

        // Lặp qua các header và tạo box
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

            // Đảm bảo box có setSize trước khi setInteractive
            box.setSize(this.scale.width * 0.3, this.scale.height * 0.2);

            // Thêm sự kiện khi người dùng nhấn vào box
            // Khi bấm vào Box
            box.setInteractive().on("pointerup", () => {
                this.currentHeaderIndex = index;
                // Truyền thông tin header vào DetailContentScene
                this.scene.start("DetailContentScene", {
                    header: header, // Truyền header vào
                });
            });

            this.boxes.push(box);
        });

        // Thêm nút điều hướng trang
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

        // Thêm nút "Back"
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

    private updatePage(): void {
        // Logic for updating the page if you want to implement dynamic page change
    }
}
