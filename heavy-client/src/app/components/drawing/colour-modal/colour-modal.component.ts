import { Component, Inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { PaletteService } from "src/app/services/drawing/palette.service";
import { CanvasComponent } from "../canvas/canvas.component";
import { Colour } from "../colour/colour";
import { hexText } from "../colour/hex-text";

@Component({
  selector: "colour-modal",
  templateUrl: "colour-modal.component.html",
  styleUrls: ["./colour-modal.component.css"],
})
export class ColourModalComponent implements OnInit {
  canvas: CanvasComponent;
  colour: Colour;
  currentColour: string;
  update: boolean; // Only update when accept() is called
  isInput: boolean;

  constructor(
    public dialogRef: MatDialogRef<ColourModalComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public canvasService: CanvasService,
    public paletteService: PaletteService,
    public translate: TranslateService
  ) {
    this.colour = new Colour();
    this.isInput = false;
  }

  disableShortcuts(evt: KeyboardEvent): void {
    evt.stopPropagation();
    let isInside = false;
    for (const hex of hexText) {
      if (evt.code === hex) {
        isInside = true;
      }
    }
    if (!isInside) {
      evt.preventDefault();
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  accept(): void {
    this.update = true;
    if (this.isInput) {
      // Use input value if that was changed last
      if (
        this.colour.r.length === 2 &&
        this.colour.g.length === 2 &&
        this.colour.b.length === 2
      ) {
        this.paletteService.newColour.next(this.colour);
        this.paletteService.updatePrimarySecondary();
        this.dialogRef.close();
      } else {
        this.openSnackBar("Veuillez choisir une couleur valide", "OK");
      }
    } else {
      this.paletteService.updatePrimarySecondary();
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    this.update = false;
    this.isInput = false;
    this.paletteService.newColour.subscribe((colour) =>
      this.updateColours(colour)
    );
  }

  updateColours(newColour: Colour): void {
    if (!this.isInput) {
      this.colour = new Colour();
      this.colour = {
        r: newColour.r,
        g: newColour.g,
        b: newColour.b,
        a: newColour.a,
      };
    }
    this.currentColour = this.paletteService.getRGBA(
      this.paletteService.colourToString(this.colour)
    );
  }

  setInput(isInput: boolean): void {
    this.isInput = isInput;
  }
}
