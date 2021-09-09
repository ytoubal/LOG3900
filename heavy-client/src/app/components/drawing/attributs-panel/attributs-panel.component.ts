import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { AttributsService } from "src/app/services/drawing/attributs.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { GridService } from "src/app/services/drawing/grid.service";
import { ModalService } from "src/app/services/drawing/modal.service";
import { PaletteService } from "src/app/services/drawing/palette.service";
import { ToolColourService } from "src/app/services/drawing/tool-colour.service";
import { CanvasComponent } from "../canvas/canvas.component";
import { Colour, RGB_LENGTH } from "../colour/colour";
import { ITool } from "../tool-interface/tool";

const FIVE = 5;
const TEN = 10;
const NINETY_FIVE = 95;
const ONE_HUNDRED = 100;

@Component({
  selector: "app-attributs-panel",
  templateUrl: "./attributs-panel.component.html",
  styleUrls: ["./attributs-panel.component.scss"],
})
export class AttributsPanelComponent implements OnInit {
  @ViewChild(CanvasComponent, { static: true }) canvasChild: CanvasComponent;

  tools: ITool[];
  myTool: ITool;
  primaryColour: string;
  secondaryColour: string;
  primary: boolean;
  shape: string;
  texture: string;
  drawingBoard: HTMLElement;

  constructor(
    public attributsService: AttributsService,
    public toolColour: ToolColourService,
    public modalService: ModalService,
    public paletteService: PaletteService,
    public snackBar: MatSnackBar,
    public canvasService: CanvasService,
    public gridService: GridService,
    public translate: TranslateService
  ) {
    this.primaryColour = "000000";
    this.secondaryColour = "000000";
  }

  ngOnInit(): void {
    this.paletteService.primaryColour.subscribe((primaryColour) =>
      this.updateColours(primaryColour, true)
    );
    this.paletteService.secondaryColour.subscribe((secondaryColour) =>
      this.updateColours(secondaryColour, false)
    );
    this.attributsService.myTool.subscribe((myTool) => (this.myTool = myTool));
  }

  openColourModal(isPrimary: boolean): void {
    this.toolColour.openColourModal(isPrimary);
  }

  disableShortcuts(evt: KeyboardEvent): void {
    evt.stopPropagation();
    const keys: string[] = ["KeyE", "Equal", "Minus", "Period"];
    if (keys.includes(evt.code)) {
      evt.preventDefault();
    }
  }

  sendTool(tool: ITool): void {
    this.attributsService.receiveTool(tool);
  }

  updateAttribut(tool: ITool, value: string, key: string): void {
    tool.attributs[key] = value;
    this.sendTool(tool);
  }

  validateInput(tool: ITool, inputValue: number, key: string): void {
    let attributValue = inputValue.toString();
    const minValue = 3;
    const maxValue = 12;
    if (key === "nbSides") {
      if (inputValue < minValue || inputValue > maxValue) {
        this.openSnackBar(
          "Veuillez définir un polygone qui comprend entre 3 à 12 côtés",
          "OK"
        );
        attributValue = "3";
      }
    }
    this.updateAttribut(tool, attributValue, key);
  }

  sendShape(tool: ITool, shape: string): void {
    this.updateAttribut(tool, shape, "shape");
  }

  sendTexture(tool: ITool, texture: string): void {
    this.updateAttribut(tool, texture, "texture");
  }

  @HostListener("contextmenu", ["$event"]) // Disables right click default menu
  onRightClick(event: { preventDefault: () => void }): void {
    event.preventDefault();
  }

  getHistoryColour(colour: string, isPrimary: boolean): void {
    if (isPrimary) {
      this.paletteService.primaryColour.next(
        this.paletteService.stringToColour(
          colour + this.paletteService.primaryColour.getValue().a
        )
      );
    } else {
      this.paletteService.secondaryColour.next(
        this.paletteService.stringToColour(
          colour + this.paletteService.secondaryColour.getValue().a
        )
      );
    }
  }

  updateColours(newStringColour: Colour, changePrimary: boolean): void {
    const newString = this.paletteService
      .colourToString(newStringColour)
      .substr(0, RGB_LENGTH);
    if (changePrimary) {
      this.primaryColour = newString;
    } else {
      this.secondaryColour = newString;
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  // @HostListener("window:keypress", ["$event"])
  // keyEvent(event: KeyboardEvent): void {
  //   let newSize = this.gridService.gridSize;
  //   switch (event.key) {
  //     case "g":
  //       this.gridService.setGrid();
  //       break;
  //     case "+":
  //       if (this.canvasService.gridActive) {
  //         if (this.gridService.gridSize < NINETY_FIVE) {
  //           newSize = this.gridService.gridSize + FIVE;
  //         } else if (this.gridService.gridSize !== ONE_HUNDRED) {
  //           newSize = ONE_HUNDRED;
  //         }
  //         this.gridService.updateGrid(newSize, true);
  //       }
  //       break;
  //     case "-":
  //       if (this.canvasService.gridActive) {
  //         if (this.gridService.gridSize > TEN) {
  //           newSize = this.gridService.gridSize - FIVE;
  //         } else if (this.gridService.gridSize !== FIVE) {
  //           newSize = FIVE;
  //         }
  //         this.gridService.updateGrid(newSize, true);
  //       }
  //       break;
  //   }
  // }
}
