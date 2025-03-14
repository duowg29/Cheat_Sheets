import CheatsheetDTO from "./CheatsheetDTO";

export default class ClassDTO {
    private _id: number;
    private _title: string;
    private _cheatsheets: CheatsheetDTO[];

    constructor(id: number, title: string, cheatsheets: CheatsheetDTO[]) {
        this._id = id;
        this._title = title;
        this._cheatsheets = cheatsheets;
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

    public get cheatsheets(): CheatsheetDTO[] {
        return this._cheatsheets;
    }

    public set cheatsheets(value: CheatsheetDTO[]) {
        this._cheatsheets = value;
    }
}
