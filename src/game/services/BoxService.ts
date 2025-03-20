import Phaser from "phaser";

export default class BoxService {
    static createBox(
        scene: Phaser.Scene,
        x: number,
        y: number,
        title: string,
        text: string
    ): Phaser.GameObjects.Container {
        const boxWidth = scene.scale.width * 0.35; // Chiều rộng của box
        const boxHeight = scene.scale.height * 0.25; // Chiều cao của box
        const padding = 12; // Padding cho box

        const box = scene.add.container(x, y); // Tạo một container cho box

        // Tạo nền cho box
        const background = scene.add
            .rectangle(0, 0, boxWidth, boxHeight, 0xffffff) // Màu nền trắng
            .setStrokeStyle(4, 0x000000) // Viền đen
            .setOrigin(0.5)
            .setSize(boxWidth, boxHeight); // Thiết lập kích thước cho nền box

        // Tạo tiêu đề cho box
        const titleText = scene.add
            .text(0, -boxHeight / 2 + padding, title, {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.02}px`,
                fontStyle: "bold",
                color: "#000",
                align: "center",
                wordWrap: {
                    width: boxWidth - padding * 2,
                    useAdvancedWrap: true,
                },
            })
            .setOrigin(0.5, 0);

        // Tạo nội dung cho box
        const contentText = scene.add.text(
            -boxWidth / 2 + padding,
            -boxHeight / 2 + 90,
            text,
            {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.015}px`,
                color: "#000",
                wordWrap: {
                    width: boxWidth - padding * 2,
                    useAdvancedWrap: true,
                },
                align: "left",
            }
        );

        // Thêm các phần tử vào box
        box.add([background, titleText, contentText]);

        // Thiết lập sự kiện khi người dùng bấm vào box
        box.setInteractive().on("pointerup", () => {
            console.log(`Box selected: ${title}`);
            // Gửi thông tin của box đã chọn vào DetailContentScene
            scene.scene.start("DetailContentScene", {
                header: { title, text },
            });
        });

        // Thiết lập kích thước cho container box để setInteractive hoạt động
        box.setSize(boxWidth, boxHeight);

        return box;
    }
}
