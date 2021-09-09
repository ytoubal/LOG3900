import { IHash } from "src/app/drawing-helper/hash";

export interface ITool {
  name: string;
  nameFR: string;
  nameDE?: string;
  attributs: IHash;
  // shortcut: string;
  isActive: boolean;
}
