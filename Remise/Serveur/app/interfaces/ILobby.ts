import { IUserInfo } from "./IUserInfo";
export interface ILobby {
    name : string;
    difficulty: string;
    owner: string;
    users: IUserInfo["public"][],
    rounds: number
    // teams: string[];
}
