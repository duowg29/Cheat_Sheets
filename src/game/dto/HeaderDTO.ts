import ContentDTO from "./ContentDTO";

export default class HeaderDTO {
    private _id: number;
    private _title: string;
    private _contents: ContentDTO[];

    constructor(id: number, title: string, contents: ContentDTO[]) {
        this._id = id;
        this._title = title;
        this._contents = contents;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get contents(): ContentDTO[] {
        return this._contents;
    }

    public set contents(value: ContentDTO[]) {
        this._contents = value;
    }
}
