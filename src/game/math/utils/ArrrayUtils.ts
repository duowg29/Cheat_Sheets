export class ArrayUtils {
    static getRandomItem(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}