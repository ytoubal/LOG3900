import { IHash } from "src/app/drawing-helper/hash";
import { ITool } from "./tool";

export class PencilTool implements ITool {
  name: string;
  nameFR: string;
  nameDE: string;
  attributs: IHash;
  // shortcut: string;
  isActive: boolean;

  constructor() {
    this.name = "Pencil";
    this.nameFR = "Crayon";
    this.nameDE = "Bleistift";
    this.attributs = {
      ["color"]: "black",
      ["size"]: 1,
    };
    // this.shortcut = "C";
    this.isActive = false;
  }
}
