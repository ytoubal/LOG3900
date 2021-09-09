import { IMessageContent } from "./IMessageContent";

export interface IRoom {
    name: string,
    history: IMessageContent[],
    admin: string
}
