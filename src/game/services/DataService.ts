import ClassDTO from "../dto/ClassDTO";
import CheatsheetDTO from "../dto/CheatsheetDTO";
import HeaderDTO from "../dto/HeaderDTO";
import ContentDTO from "../dto/ContentDTO";

export default class DataService {
    static loadClasses(jsonData: any): ClassDTO[] {
        return jsonData.map(
            (cls: any) =>
                new ClassDTO(
                    cls.id,
                    cls.title,
                    cls.cheatsheets.map(
                        (ch: any) =>
                            new CheatsheetDTO(
                                ch.id,
                                ch.name,
                                ch.headers.map(
                                    (hd: any) =>
                                        new HeaderDTO(
                                            hd.id,
                                            hd.title,
                                            hd.contents.map(
                                                (ct: any) =>
                                                    new ContentDTO(
                                                        ct.id,
                                                        ct.text
                                                    )
                                            )
                                        )
                                )
                            )
                    )
                )
        );
    }
}
