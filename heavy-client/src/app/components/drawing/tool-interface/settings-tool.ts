import { IHash } from "src/app/drawing-helper/hash";
import { ITool } from "./tool";

export class SettingsTool implements ITool {
  name: string;
  nameFR: string;
  nameDE: string;
  attributs: IHash;
  // shortcut: string;
  isActive: boolean;

  constructor() {
    this.name = "Grid";
    this.nameFR = "Grille";
    this.nameDE = "Gitter";
    this.attributs = {
      ["opacity"]: 100,
      ["size"]: 100,
    };
    // this.shortcut = "";
    this.isActive = false;
  }
}
