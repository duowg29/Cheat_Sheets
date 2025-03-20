export default class CardDTO {
    id: number;
    header: string;
    cardId: string;

    constructor(id: number, header: string, cardId: string) {
        this.id = id;
        this.header = header;
        this.cardId = cardId;
    }
}
