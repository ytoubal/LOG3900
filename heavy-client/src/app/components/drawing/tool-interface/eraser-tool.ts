import { IHash } from "src/app/drawing-helper/hash";
import { ITool } from "./tool";

export class EraserTool implements ITool {
  name: string;
  nameFR: string;
  nameDE: string;
  attributs: IHash;
  // shortcut: string;
  isActive: boolean;

  constructor() {
    this.name = "Eraser";
    this.nameFR = "Efface";
    this.nameDE = "Löschen";
    this.attributs = {
      ["size"]: "3",
    };
    // this.shortcut = "E";
    this.isActive = false;
  }
}
