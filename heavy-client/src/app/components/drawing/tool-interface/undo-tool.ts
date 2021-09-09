import { IHash } from "src/app/drawing-helper/hash";
import { ITool } from "./tool";

export class UndoTool implements ITool {
  name: string;
  nameFR: string;
  nameDE: string;
  attributs: IHash;
  // shortcut: string;
  isActive: boolean;

  constructor() {
    this.name = "Undo";
    this.nameFR = "Annuler";
    this.nameDE = "Rückgängig";
    this.attributs = {};
    // this.shortcut = "Ctrl-Z";
    this.isActive = false;
  }
}
