import { IHash } from "src/app/drawing-helper/hash";
import { ITool } from "./tool";

export class RedoTool implements ITool {
  name: string;
  nameFR: string;
  nameDE: string;
  attributs: IHash;
  // shortcut: string;
  isActive: boolean;

  constructor() {
    this.name = "Redo";
    this.nameFR = "Refaire";
    this.nameDE = "Wiederholen";
    this.attributs = {};
    // this.shortcut = "Ctrl-Shift-Z";
    this.isActive = false;
  }
}
