import HeaderDTO from "./HeaderDTO";

export default class CheatsheetDTO {
    private _id: number;
    private _name: string;
    private _headers: HeaderDTO[];

    constructor(id: number, name: string, headers: HeaderDTO[]) {
        this._id = id;
        this._name = name;
        this._headers = headers;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get headers(): HeaderDTO[] {
        return this._headers;
    }

    public set headers(value: HeaderDTO[]) {
        this._headers = value;
    }
}
