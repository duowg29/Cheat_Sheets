import ClassDTO from "../dto/ClassDTO";
import CheatsheetDTO from "../dto/CheatsheetDTO";
import HeaderDTO from "../dto/HeaderDTO";
import ContentDTO from "../dto/ContentDTO";

// Hàm tạo ID tự động với tiền tố và bộ đếm
let idCounter = 1; // Khởi tạo bộ đếm

function generateId(prefix: string): string {
    const id = `${prefix}${idCounter}`;
    idCounter++; // Tăng bộ đếm lên sau mỗi lần gọi
    return id;
}

export default class DataService {
    static loadClasses(jsonData: any): ClassDTO[] {
        if (!Array.isArray(jsonData)) {
            throw new Error("Dữ liệu không hợp lệ, jsonData phải là mảng.");
        }

        return jsonData.map((cls: any) => {
            // Kiểm tra xem cheatsheets có tồn tại và là mảng không
            if (!cls.cheatsheets || !Array.isArray(cls.cheatsheets)) {
                console.warn(
                    `Cảnh báo: cheatsheets không phải là mảng trong lớp học: ${cls.title}`
                );
                cls.cheatsheets = []; // Nếu không phải mảng, khởi tạo mảng trống
            }

            return new ClassDTO(
                generateId("class"), // Tạo ID cho lớp học
                cls.title,
                cls.cheatsheets.map((ch: any) => {
                    // Kiểm tra xem headers có tồn tại và là mảng không
                    if (!ch.headers || !Array.isArray(ch.headers)) {
                        console.warn(
                            `Cảnh báo: headers không phải là mảng trong cheatsheet: ${ch.name}`
                        );
                        ch.headers = []; // Nếu không phải mảng, khởi tạo mảng trống
                    }

                    return new CheatsheetDTO(
                        generateId("sheet"), // Tạo ID cho cheatsheet
                        ch.name,
                        ch.headers.map((hd: any) => {
                            // Kiểm tra xem contents có tồn tại và là mảng không
                            if (!hd.contents || !Array.isArray(hd.contents)) {
                                console.warn(
                                    `Cảnh báo: contents không phải là mảng trong header: ${hd.title}`
                                );
                                hd.contents = []; // Nếu không phải mảng, khởi tạo mảng trống
                            }

                            const image = hd.image
                                ? {
                                      path: hd.image.path,
                                      x: hd.image.x,
                                      y: hd.image.y,
                                      width: hd.image.width,
                                      height: hd.image.height,
                                      rotation: hd.image.rotation,
                                  }
                                : null;

                            return new HeaderDTO(
                                generateId("header"), // Tạo ID cho header
                                hd.title,
                                hd.contents.map(
                                    (ct: any) =>
                                        new ContentDTO(
                                            generateId("content"),
                                            ct.text
                                        ) // Tạo ID cho content
                                ),
                                image
                            );
                        })
                    );
                })
            );
        });
    }
}
