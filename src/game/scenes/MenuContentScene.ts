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
        this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0xe6f0fa)
            .setOrigin(0);

        const cheatsheetTitleText = this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.05,
                this.cheatsheet.name,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.05}px`,
                    fontStyle: "bold",
                    color: "#2c3e50",
                    align: "center",
                    shadow: {
                        offsetX: 2,
                        offsetY: 2,
                        color: "#000",
                        blur: 4,
                        stroke: true,
                        fill: true,
                    },
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

            // Tùy chỉnh giao diện box
            box.list.forEach((child: any) => {
                if (child instanceof Phaser.GameObjects.Rectangle) {
                    child.setFillStyle(0xffffff, 0.95);
                    child.setStrokeStyle(2, 0x3498db);
                } else if (child instanceof Phaser.GameObjects.Text) {
                    child.setColor("#34495e");
                    child.setShadow(1, 1, "#000", 2, true, true);
                }
            });

            // Thêm hiệu ứng hover cho box
            box.setInteractive()
                .on("pointerup", () => {
                    this.currentHeaderIndex = index;
                    this.scene.start("DetailContentScene", {
                        header: header,
                    });
                })
                .on("pointerover", () => {
                    this.tweens.add({
                        targets: box,
                        scale: 1.05,
                        duration: 200,
                        ease: "Power2",
                    });
                    box.list.forEach((child: any) => {
                        if (child instanceof Phaser.GameObjects.Rectangle) {
                            child.setFillStyle(0xe6f0fa, 1);
                        }
                    });
                })
                .on("pointerout", () => {
                    this.tweens.add({
                        targets: box,
                        scale: 1,
                        duration: 200,
                        ease: "Power2",
                    });
                    box.list.forEach((child: any) => {
                        if (child instanceof Phaser.GameObjects.Rectangle) {
                            child.setFillStyle(0xffffff, 0.95);
                        }
                    });
                });

            this.boxes.push(box);
        });

        // Tạo nút Up
        this.upButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.4, "▲", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#fff",
                backgroundColor: "#3498db",
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000",
                    blur: 4,
                    stroke: true,
                    fill: true,
                },
            })
            .setInteractive()
            .setOrigin(0.5)
            .on("pointerover", () => {
                this.upButton.setBackgroundColor("#2980b9");
            })
            .on("pointerout", () => {
                this.upButton.setBackgroundColor("#3498db");
            })
            .on("pointerdown", () => this.scrollPage(-1));

        // Tạo nút Down
        this.downButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.6, "▼", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#fff",
                backgroundColor: "#3498db",
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000",
                    blur: 4,
                    stroke: true,
                    fill: true,
                },
            })
            .setInteractive()
            .setOrigin(0.5)
            .on("pointerover", () => {
                this.downButton.setBackgroundColor("#2980b9");
            })
            .on("pointerout", () => {
                this.downButton.setBackgroundColor("#3498db");
            })
            .on("pointerdown", () => this.scrollPage(1));

        const backButton = this.add
            .text(this.scale.width * 0.03, this.scale.height * 0.03, "Back", {
                fontFamily: "Arial",
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#fff",
                backgroundColor: "#e74c3c", // Màu đỏ
                padding: { left: 15, right: 15, top: 8, bottom: 8 },
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000",
                    blur: 4,
                    stroke: true,
                    fill: true,
                },
            })
            .setInteractive()
            .setOrigin(0)
            .on("pointerover", () => {
                backButton.setBackgroundColor("#c0392b");
                backButton.setScale(1.1);
            })
            .on("pointerout", () => {
                backButton.setBackgroundColor("#e74c3c");
                backButton.setScale(1);
            })
            .on("pointerup", () => {
                this.scene.stop("MenuContentScene");
                this.scene.start("GamePlayScene", {
                    cheatsheet: this.cheatsheet,
                });
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
