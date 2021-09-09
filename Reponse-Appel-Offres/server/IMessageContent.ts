import { IUser } from "./IUser";

export interface IMessageContent {
    message: string,
    sender: IUser,
    timestamp: string,
}