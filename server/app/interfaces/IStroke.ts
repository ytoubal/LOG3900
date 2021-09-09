import { IPoint } from "./IPoint";

export interface IStroke {
    path: IPoint[],
    color: string,
    size: number
}
