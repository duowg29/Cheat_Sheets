export default class ContentDTO {
    private _id: number;
    private _text: string;

    constructor(id: number, text: string) {
        this._id = id;
        this._text = text;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        this._text = value;
    }
}
