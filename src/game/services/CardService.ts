import Phaser from "phaser";
import CardDTO from "../dto/CardDTO";

export default class CardService {
    static createCard(
        scene: Phaser.Scene,
        x: number,
        y: number,
        cardDTO: CardDTO // Nhận CardDTO thay vì các tham số riêng biệt
    ): Phaser.GameObjects.Container {
        const cardWidth = scene.scale.width * 0.3;
        const cardHeight = scene.scale.height * 0.2;
        const padding = 10;

        const card = scene.add.container(x, y);

        const background = scene.add
            .rectangle(0, 0, cardWidth, cardHeight, 0xffffff)
            .setStrokeStyle(3, 0x000000)
            .setOrigin(0.5);

        const headerText = scene.add
            .text(0, -cardHeight / 2 + padding, cardDTO.header, {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.015}px`,
                fontStyle: "bold",
                color: "#222",
                align: "center",
                wordWrap: {
                    width: cardWidth - padding * 2,
                    useAdvancedWrap: true,
                },
            })
            .setOrigin(0.5, 0);

        // Không cần contentText nữa vì chỉ hiển thị header
        card.add([background, headerText]);

        // Đặt kích thước cho container trước khi thiết lập tính tương tác
        card.setSize(cardWidth, cardHeight);

        // Thiết lập card là interactive và phát sự kiện khi chọn thẻ
        card.setInteractive().on("pointerup", () => {
            console.log("Card selected:", cardDTO.header);
            scene.events.emit("card-selected", cardDTO); // Phát sự kiện chọn card
        });

        return card;
    }
}
