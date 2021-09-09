import { IStroke } from "./IStroke";

export interface IWordImage {
    word: string,
    hints: string[],
    difficulty: string,
    drawing: IStroke[],
    mode: string
}
